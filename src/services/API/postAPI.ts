import axiosClient from "../axiosClient"
import { buildQuery } from "../../utils/helpers/queryHelpers"
import type { GetPostsParams, PostListResponse, CreatePostPayload, CreatePostResponse, UpdatePostPayload, UpdatePostResponse, PostItem } from "../../types/apiResponse/postResponse"

export const getPosts = async (params: GetPostsParams = {}) => {
	const query = buildQuery({
		postId: params.postId,
		farmerId: params.farmerId,
		status: params.status,
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 10,
	})
	return axiosClient.get<PostListResponse>(`/posts${query}`)
}

export const getPostById = async (postId: number): Promise<{ data: PostItem | undefined }> => {
	// API may return a PostListResponse (items + paging) OR a single PostItem when filtered by postId.
	const res = await axiosClient.get<PostListResponse | PostItem>(`/posts`, { params: { postId } })
	const data = res.data as PostListResponse | PostItem
	let post: PostItem | undefined

	if ('items' in data && Array.isArray(data.items)) {
		post = (data.items[0] as PostItem) || undefined
	} else if ('postId' in data && typeof data.postId === 'number') {
		post = data as PostItem
	} else {
		post = undefined
	}

	// Return a minimal shape compatible with callers that read `.data`
	return { data: post }
}

export const createPost = async (payload: CreatePostPayload) => {
	return axiosClient.post<CreatePostResponse>(`/posts`, payload)
}

export const updatePost = async (id: number, payload: UpdatePostPayload) => {
	return axiosClient.put<UpdatePostResponse>(`/posts/${id}`, payload)
}

export const updatePostStatus = async (id: number, status: string) => {
	return axiosClient.put<PostListResponse>(`/posts/${id}/status`, undefined, { params: { status } })
}

export const deletePost = async (id: number) => {
	return axiosClient.delete<void>(`/posts/${id}`)
}

export default {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	updatePostStatus,
	deletePost,
}
