/** 总线事件 */
export enum BusEvent {
  ADD_ENTRIES = "add:entries",
  ADD_FILELIST = "add:filelist",
  UPLOAD_SUCCESS = "upload:success",

  PLAY_MUSIC = "music:play",
  PAUSE_MUSIC = "music:pause",
}

// 事件回调参数
export interface EventParams {
  [BusEvent.ADD_ENTRIES]: [event: AddEntriesEvent]
  [BusEvent.ADD_FILELIST]: [event: AddFileListEvent]
  [BusEvent.UPLOAD_SUCCESS]: [folderId?: string | null]

  [BusEvent.PLAY_MUSIC]: [url: string]
  [BusEvent.PAUSE_MUSIC]: []
}
