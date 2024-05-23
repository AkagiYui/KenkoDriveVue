/** 总线事件 */
export enum BusEvent {
  ADD_ENTRIES = "add:entries",
  UPLOAD_SUCCESS = "upload:success",
}

// 事件回调参数
export interface EventParams {
  [BusEvent.ADD_ENTRIES]: [event: AddEntriesEvent]
  [BusEvent.UPLOAD_SUCCESS]: [folderId: string | undefined]
}
