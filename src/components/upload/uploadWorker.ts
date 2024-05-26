/**
 * 上传文件 worker
 *
 * feature:
 * - [x] 上传文件
 * - [x] 上传进度回调
 * - [ ] 上传失败重试
 * - [ ] 上传取消
 * - [ ] 上传暂停
 * - [ ] 分段上传
 * - [ ] 上传速度
 * - [ ] 上传限速
 * - [ ] 多文件同时上传
 * - [ ] 多线程计算哈希值(唯一CPU密集型任务)
 *
 * ## API
 * - { command: "init", baseUrl: string, token: string } 初始化，设置 基础URL 和 AccessToken
 * - { command: "append", file: File, filename: string, folderId: number } 添加文件到上传队列
 *
 * ## Events
 * - { event: "appended", task: UploadTask } 文件添加成功
 * - { event: "started", id: number } 文件开始上传
 * - { event: "progress", id: number, progress: number } 文件上传进度
 * - { event: "mirrored", id: number } 文件秒传成功
 * - { event: "uploaded", id: number } 文件上传成功
 * - { event: "merged", id: number } 文件合并成功
 * - { event: "failed", id: number } 文件上传失败
 */

import { SHA256Calculator } from "./HashCalculator"

/** logger */
function log(message: string, ...optionalParams: any[]) {
  console.log("UploadWorker", message, ...optionalParams)
}

log("loaded")

/** api路由 */
onmessage = async (e) => {
  const { command, ...args } = e.data
  switch (command) {
    case "init":
      onInit(args)
      return
    case "append":
      await onAppendFile(args)
      return
  }
  log(`got unknown data: ${e.data}`)
}

const taskList: UploadTask[] = [] // 上传任务队列
const config: UploaderWorkerConfig = {
  mirrorUrl: "", // 秒传地址
  createTaskUrl: "", // 创建任务地址
  sendChunkUrl: "", // 上传地址
  accessToken: undefined, // 访问令牌
}

/**
 * 接口 初始化参数
 */
function onInit({ baseUrl, token }: { baseUrl: string; token: string }) {
  config.accessToken = token

  config.mirrorUrl = `${baseUrl}/mirror`
  config.createTaskUrl = `${baseUrl}/task`
  config.sendChunkUrl = `${baseUrl}/task`
  log("inited", config)
}

/**
 * 接口 添加文件到队列
 */
async function onAppendFile(request: AppendFileRequest) {
  const task: UploadTask = {
    id: generateId(),
    ...request,
  }
  log("append", task)
  taskList.push(task)
  postMessage({ event: "appended", task: task })
  handleTaskList()
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
const generateId: () => number = (() => {
  let id = 0
  return () => {
    return id++
  }
})()

/** 处理任务队列 */
const handleTaskList = (() => {
  let running = false
  return async () => {
    if (running) {
      return
    }
    running = true
    while (taskList.length > 0) {
      const task = taskList.shift()!
      log("start task", task)
      postMessage({ event: "started", id: task.id })
      const [hash, success] = await tryMirrorFile(task)
      if (success) {
        postMessage({ event: "mirrored", id: task.id })
        continue
      }
      await uploadByTask(task, hash)
    }
    running = false
  }
})()

/**
 * 尝试秒传文件
 * @param task 上传任务
 * @returns {boolean} 是否成功
 */
async function tryMirrorFile(task: UploadTask): Promise<[string, boolean]> {
  const { id, file, filename, folderId } = task

  // 计算文件哈希
  const hashCalculator = new SHA256Calculator()
  const reader = new FileReader()

  // 将FileReader的读取操作封装为Promise
  const readAsArrayBufferPromise = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })

  const fileBuffer = await readAsArrayBufferPromise
  hashCalculator.update(fileBuffer as ArrayBuffer)
  const hash = await hashCalculator.digest()

  try {
    const requestBody = {
      hash: hash,
      filename: filename,
      size: file.size,
      folder: folderId,
    }
    const requestHeader = {
      "Content-Type": "application/json",
    }
    if (config.accessToken) {
      requestHeader["Authorization"] = `Bearer ${config.accessToken}`
    }

    // 等待fetch操作完成
    const response = await fetch(config.mirrorUrl, {
      method: "POST",
      headers: requestHeader,
      body: JSON.stringify(requestBody),
    })

    // 取出data字段
    const responseJson = await response.json()
    log("mirror response", responseJson)
    const result = responseJson["data"] as boolean
    if (result) {
      log("mirror success", id)
      return [hash, true] // 成功时返回true
    } else {
      log("mirror failed", id)
      return [hash, false] // 失败时返回false
    }
  } catch (error) {
    log("mirror error", error)
    return [hash, false] // 出现异常时返回false
  }
}

/**
 * 上传文件
 */
async function uploadByTask(task: UploadTask, fileHash: string): Promise<void> {
  log("createUploadTask", task)
  // 创建上传任务
  const { id, file, filename, folderId } = task
  const chunkSize = 1024 * 1024 * 2 // 2MB
  const chunkCount = Math.ceil(file.size / chunkSize)
  // 请求创建
  const createTaskRequest = {
    hash: fileHash,
    filename: filename,
    filesize: file.size,
    type: file.type,
    folder: folderId,
    chunkSize: chunkSize,
    chunkCount: chunkCount,
  }
  const requestHeader = {
    "Content-Type": "application/json",
  }
  if (config.accessToken) {
    requestHeader["Authorization"] = `Bearer ${config.accessToken}`
  }
  const response = await fetch(config.createTaskUrl, {
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(createTaskRequest),
  })
  const responseJson = await response.json()
  log("createTask response", responseJson)
  const taskId = responseJson["data"]
  log("taskId", taskId)
  // 分片
  const chunks: { index: number; hash: string; blob: Blob }[] = []
  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const blob = file.slice(start, end)
    const hashCalculator = new SHA256Calculator()
    hashCalculator.update(await blob.arrayBuffer())
    const hash = await hashCalculator.digest()
    chunks.push({ index: i, hash: hash, blob: blob })
  }
  // 封装上传
  function uploadChunk(chunk, onProgress) {
    return new Promise<void>((resolve, reject) => {
      const { index, hash, blob } = chunk
      const xhr = new XMLHttpRequest()
      const url = `${config.sendChunkUrl}/${taskId}/chunk`
      xhr.open("POST", url, true)
      if (config.accessToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${config.accessToken}`)
      }
      xhr.upload.onprogress = function (event) {
        onProgress(event, index)
      }
      xhr.onload = async function () {
        if (xhr.status === 200) {
          log("upload success")
          resolve()
          // 上传成功，获取data字段
          const responseJson = JSON.parse(xhr.responseText)
          const finished = responseJson["data"]
          if (finished) {
            log("upload finished")
            // 轮询检查合并状态
            const checkMergeStatus = async () => {
              const response = await fetch(
                `${config.createTaskUrl}/${taskId}`,
                {
                  headers: requestHeader,
                },
              )
              const responseJson = await response.json()
              log("checkMergeStatus", responseJson)
              const merged = responseJson["data"]["merged"]
              if (merged) {
                log("merge success")
                postMessage({ event: "merged", id: id })
              } else {
                setTimeout(checkMergeStatus, 1000)
              }
            }
            checkMergeStatus()
          }
        } else {
          log("upload failed", xhr.responseText)
          reject(
            new Error(`Failed to upload chunk ${index}: ${xhr.statusText}`),
          )
        }
      }
      xhr.onerror = function () {
        log("upload failed", xhr.responseText)
        reject(new Error(`Network error while uploading chunk ${index}`))
      }
      const formData = new FormData()
      formData.append("blob", blob)
      formData.append("hash", hash)
      formData.append("index", index.toString())
      xhr.send(formData)
    })
  }

  // 进度监控
  const progressList = new Array(chunkCount).fill(0)
  function onProgress(event, index) {
    log(`Chunk ${index} progress: ${event.loaded}/${event.total}`)
    progressList[index] = event.loaded
    const overallProgress =
      progressList.reduce((acc, cur) => acc + cur, 0) / file.size
    log(`Overall progress: ${overallProgress * 100}%`)
    postMessage({
      event: "progress",
      id: id,
      progress: overallProgress,
    })
  }

  Promise.all(chunks.map((chunk) => uploadChunk(chunk, onProgress)))
    .then(() => {
      // 所有上传操作成功完成
      log("all chunks uploaded")
      postMessage({
        event: "uploaded",
        id: id,
      })
    })
    .catch((error) => {
      // 至少一个上传操作失败
      log("upload failed", error)
      postMessage({ event: "failed", id: id }) // 发送一个消息表示失败
    })
}
