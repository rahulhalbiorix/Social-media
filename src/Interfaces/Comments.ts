import type { User } from './User'

export interface Comments {
  _id: string
  userId: User
  postId: string
  text: string
  likesCount: number
  repliesCount: number
  createdAt: string
  isLiked: boolean
  replies: any[]
}
