import type { User } from './User'

export interface Post {
  _id: string
  userId: string
  title: string
  description: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
  user: User
}
