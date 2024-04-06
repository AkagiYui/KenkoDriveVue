type DisplayAnnouncement = {
  title: string
  content: string
  createTime: string
  updateTime: string
  userNickname: string
}

interface Announcement {
  id: string
  title: string
  content: string
  createTime: string
  updateTime: string
  userId: string
  enabled: boolean
}
