/**
 * 上传文件 worker
 *
 * feature:
 * - [x] 上传文件
 * - [x] 上传进度回调
 * - [x] 上传失败重试
 * - [ ] 上传取消
 * - [ ] 上传暂停
 * - [x] 分段上传
 * - [ ] 上传速度
 * - [ ] 上传限速
 *
 * ## API
 * - { command: "init", baseUrl: string, token: string } 初始化(基本URL, AccessToken)
 * - { command: "append", file: File, filename: string, folderId: number } 上传文件(文件, 文件名, 文件夹ID)
 *
 * ## Events
 * - { event: "started", id: number } 开始上传(任务ID)
 * - { event: "progress", id: number, progress: number } 上传进度(任务ID, 0~1进度)
 * - { event: "mirrored", id: number } 秒传成功(任务ID)
 * - { event: "uploaded", id: number } 上传成功(任务ID)
 * - { event: "merged", id: number } 合并成功(任务ID)
 * - { event: "failed", id: number } 上传失败(任务ID)
 */

import { SHA256Calculator } from "./HashCalculator"

interface UploadWorkerTask extends UploadTask {
  buffer: ArrayBuffer
}

interface FileChunk {
  index: number
  hash: string
  blob: Blob
}

/** logger */
function log(message: string, ...optionalParams: any[]) {
  console.debug("UploadWorker", message, ...optionalParams)
}

log("loaded")

const COMMAND_FUNC_MAP: Record<UploadWorkerCommand, Function> = {
  init: onInit,
  append: onAppendFile,
}

onmessage = async ({ data }) => {
  const { command, ...args } = data
  await COMMAND_FUNC_MAP[command](args)
}

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
  log("initd", config)
}

/**
 * 接口 添加文件到队列
 */
async function onAppendFile(task: UploadTask) {
  log("start task", task)
  // 一个文件只读取一次 ArrayBuffer
  const buffer = await task.file.arrayBuffer()
  const workerTask: UploadWorkerTask = { buffer, ...task }
  const [hash, success] = await tryMirrorFile(workerTask)
  if (success) {
    postMessage({ event: "mirrored", id: task.id })
    return
  }
  await uploadByTask(workerTask, hash)
}

/**
 * 尝试秒传文件
 * @param task 上传任务
 * @returns {boolean} 是否成功
 */
async function tryMirrorFile({ id, file, filename, folderId, buffer }: UploadWorkerTask): Promise<[string, boolean]> {
  const hashCalculator = new SHA256Calculator()
  hashCalculator.update(new Uint8Array(buffer))
  const hash = await hashCalculator.digest()
  try {
    const responseJson = await postData(config.mirrorUrl, {
      hash,
      filename,
      size: file.size,
      folder: folderId,
    })
    log("mirror response", responseJson)
    const { data } = responseJson
    log(data)
    if (data) {
      log("mirror success", id)
      return [hash, true] // 成功时返回true
    }
    log("mirror failed", id)
    return [hash, false] // 失败时返回false
  } catch (error) {
    log("mirror error", error)
    return [hash, false] // 出现异常时返回false
  }
}

/**
 * 上传文件
 */
async function uploadByTask(task: UploadWorkerTask, hash: string): Promise<void> {
  log("createUploadTask", task)
  // 创建上传任务
  const { id, file, filename, folderId, buffer } = task
  const chunkSize = 1024 * 1024 * 2 // 2MB
  const chunkCount = Math.ceil(file.size / chunkSize)
  const responseJson = await postData(config.createTaskUrl, {
    hash,
    filename,
    filesize: file.size,
    type: file.type,
    folder: folderId,
    chunkSize,
    chunkCount,
  })
  log("createTask response", responseJson)
  const taskId = responseJson.data
  log("taskId", taskId)
  // 分片
  const chunks: FileChunk[] = []
  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize
    const intactCount = chunkCount - 1
    const len = i === intactCount ? file.size - chunkSize * intactCount : chunkSize
    // 使用视图对象操作，防止多次复制
    const u8 = new Uint8Array(buffer, start, len)
    const hashCalculator = new SHA256Calculator()
    hashCalculator.update(u8)
    const hash = await hashCalculator.digest()
    chunks.push({ index: i, hash: hash, blob: new Blob([u8]) })
  }
  // 进度监控
  const progressList = new Array(chunkCount).fill(0)
  const onProgress = (event, index) => {
    log(`Chunk ${index} progress: ${event.loaded}/${event.total}`)
    progressList[index] = event.loaded
    const overallProgress = progressList.reduce((acc, cur) => acc + cur, 0) / file.size
    log(`Overall progress: ${overallProgress * 100}%`)
    postMessage({
      event: "progress",
      id: id,
      progress: overallProgress,
    })
  }
  const chunkTaskList = chunks.map((chunk) => retry(uploadChunkTask, 3)(taskId, chunk, onProgress))
  try {
    await Promise.all(chunkTaskList)
    log("upload finished")
    postMessage({ event: "uploaded", id })
    await checkMergeStatus(taskId)
    postMessage({ event: "merged", id })
    // 所有上传操作成功完成
    log("all chunks uploaded")
  } catch (error) {
    // 至少一个上传操作失败
    log("upload failed", error)
    postMessage({ event: "failed", id }) // 发送一个消息表示失败
  }
}

// 封装上传
async function uploadChunkTask(taskId: any, { index, hash, blob }: FileChunk, onProgress: Function): Promise<void> {
  const xhr = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    xhr.open("POST", `${config.sendChunkUrl}/${taskId}/chunk`, true)
    if (config.accessToken) {
      xhr.setRequestHeader("Authorization", `Bearer ${config.accessToken}`)
    }
    xhr.upload.onprogress = (event) => onProgress(event, index)
    xhr.onload = () => {
      if (xhr.status !== 200) {
        log("upload failed", xhr.responseText)
        reject(new Error(`Failed to upload chunk ${index}: ${xhr.statusText}`))
        return
      }
      log("upload success")
      resolve()
    }
    const onError = () => {
      log("upload failed", xhr.responseText)
      reject(new Error(`Network error while uploading chunk ${index}`))
    }
    xhr.onerror = onError
    xhr.ontimeout = onError
    const formData = new FormData()
    formData.append("blob", blob)
    formData.append("hash", hash)
    formData.append("index", index.toString())
    xhr.send(formData)
  })
}

async function checkMergeStatus(taskId: number): Promise<void> {
  type Response = {
    data: {
      merged: boolean
    }
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const responseJson = await getData<Response>(`${config.createTaskUrl}/${taskId}`)
    log("checkMergeStatus", responseJson)
    const merged = responseJson.data.merged
    if (merged) {
      log("merge success")
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

function makeHeaders(): Record<string, string> {
  if (config.accessToken) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
    }
  }
  return {
    "Content-Type": "application/json",
  }
}

async function getData<T = any>(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: makeHeaders(),
  })
  const json: T = await response.json()
  return json
}

async function postData<T = any>(url: string, data: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: makeHeaders(),
    body: JSON.stringify(data),
  })
  const json: T = await response.json()
  return json
}

function retry(f: Function, count: number): Function {
  let retryCount = 0
  return async (...args: any) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        retryCount += 1
        return await f(...args)
      } catch (error) {
        if (retryCount > count) {
          throw error
        }
      }
    }
  }
}
