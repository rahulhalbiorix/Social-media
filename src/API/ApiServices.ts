import axios from 'axios'
import { useUserAuth } from '@/stores/userAuth'
import { useApiLink } from '@/API/apiLink'

const { API_URL } = useApiLink()

const getAuthHeader = () => {
  const authStore = useUserAuth()
  return { Authorization: `Bearer ${authStore.token}` }
}

export const fetchPostsAPI = (page = 1, limit = 10) =>
  axios.get(`${API_URL}/posts/list-post`, {
    params: { page, limit },
    headers: getAuthHeader(),
  })

export const createPostAPI = (data: any) =>
  axios.post(`${API_URL}/posts/create-post`, data, {
    headers: getAuthHeader(),
  })

export const updatePostAPI = (id: any, data: any) =>
  axios.put(`${API_URL}/posts/update/${id}`, data, {
    headers: getAuthHeader(),
  })

export const deletePostAPI = (id: any) =>
  axios.delete(`${API_URL}/posts/delete/${id}`, {
    headers: getAuthHeader(),
  })

export const fetchCommentAPI = (id: any) =>
  axios.get(`${API_URL}/comments/get-comments/${id}`, {
    headers: getAuthHeader(),
  })

export const addCommentAPI = (data: any) =>
  axios.post(`${API_URL}/comments/add-comment`, data, {
    headers: getAuthHeader(),
  })

export const deleteCommentAPI = (id: any) =>
  axios.delete(`${API_URL}/comments/delete/${id}`, {
    headers: getAuthHeader(),
  })

export const loadNestedReply = (parentId: string, commentId: string, page = 1, limit = 30) =>
  axios.get(`${API_URL}/comments/load-more-replies`, {
    headers: getAuthHeader(),
    params: {
      parentReplyId: parentId,
      commentId: commentId,
      page: page,
      limit: limit,
    },
  })

export const addReplyAPI = (replyMessage: any) =>
  axios.post(`${API_URL}/replies/add-reply`, replyMessage, {
    headers: getAuthHeader(),
  })

export const deleteReplyAPI = (replyId: any) =>
  axios.delete(`${API_URL}/replies/delete/${replyId}`, {
    headers: getAuthHeader(),
  })

export const toggleLikeButton = (data: any) =>
  axios.post(`${API_URL}/likes/like-unlike`, data, {
    headers: getAuthHeader(),
  })
