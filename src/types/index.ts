/** 总线事件 */
export enum BusEvent {
  ADD_ENTRIES = "add:entries",
  ADD_FILELIST = "add:filelist",
  UPLOAD_SUCCESS = "upload:success",
}

// 事件回调参数
export interface EventParams {
  [BusEvent.ADD_ENTRIES]: [event: AddEntriesEvent]
  [BusEvent.ADD_FILELIST]: [event: AddFileListEvent]
  [BusEvent.UPLOAD_SUCCESS]: [folderId: string | undefined]
}
