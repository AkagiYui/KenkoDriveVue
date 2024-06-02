import { fetchEventSource } from "@microsoft/fetch-event-source"
import { default as Request, config } from "../request"
import { useUserInfo } from "@/stores/user-info"

/** 获取后端版本号 */
export async function getBackendVersion(): Promise<string> {
  const res = await Request.get<string>("/system/version")
  return res.data
}

/** 获取配置 */
export async function getConfig(): Promise<object> {
  const res = await Request.get<object>("/system/setting")
  return res.data
}

/**
 * 更新设置
 * @param key 设置键
 * @param value 设置值
 */
export async function updateSetting(key: string, value: string | number | boolean): Promise<void> {
  await Request.put(
    `/system/setting/${key}`,
    { value },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )
}

/** 获取 是否开放注册 */
export async function getRegisterEnabled(): Promise<boolean> {
  const res = await Request.get<boolean>("/system/setting/register")
  return res.data
}

export function receiveSystemMemorySse(callback: (data: any) => void) {
  const source = new EventSource(config.baseURL + "/system/memory/sse")
  source.onmessage = (event) => {
    callback(JSON.parse(event.data))
  }
  return source
}

/**
 * 获取系统内存信息
 * @param receiveData 接收数据回调
 * @returns 关闭函数
 */
export function useSystemMemory(
  receiveData: (data: {
    time: number
    totalMemory: number
    freeMemory: number
    usedMemory: number
    maxMemory: number
  }) => void,
): {
  close: () => void
} {
  const { requestToken } = useUserInfo()
  const ctrl = new AbortController()
  fetchEventSource(`${config.baseURL}/system/memory/sse`, {
    onmessage(ev) {
      const data = JSON.parse(ev.data)
      // 如果是数组
      if (Array.isArray(data)) {
        for (const item of data) {
          receiveData(item)
        }
      } else {
        // 如果是对象
        receiveData(data)
      }
    },
    headers: {
      Authorization: `Bearer ${requestToken}`,
    },
    signal: ctrl.signal,
  })

  return {
    close: () => ctrl.abort(),
  }
}
