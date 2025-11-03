/** Bảng post_comments */
export interface PostComment {
  commentId: number
  postId: number
  userId: number
  commentContent: string
  createdAt: string
  updatedAt: string
}
