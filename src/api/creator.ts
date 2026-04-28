import request from './request'
import type { ApiResponse } from './request'
import type { BookResponse, BookChapterResponse, BookListResponse } from './book'

/**
 * 获取创作者自己的书籍列表
 */
export const getCreatorBooksApi = (params?: { page?: number; size?: number }) => {
    return request.get<ApiResponse<BookListResponse>>('/books/own/list', { params })
}

/**
 * 创建新书籍
 */
export const createBookApi = (data: Partial<BookResponse>) => {
    return request.post<ApiResponse<BookResponse>>('/creator/books', data)
}

/**
 * 更新书籍信息
 */
export const updateBookApi = (id: string, data: Partial<BookResponse>) => {
    return request.put<ApiResponse<BookResponse>>(`/creator/books/${id}`, data)
}

/**
 * 删除书籍
 */
export const deleteBookApi = (id: string) => {
    return request.delete<ApiResponse<any>>(`/creator/books/${id}`)
}

/**
 * 创建新章节
 */
export const createChapterApi = (bookId: string, data: Partial<BookChapterResponse>) => {
    return request.post<ApiResponse<BookChapterResponse>>(`/creator/books/${bookId}/chapters`, data)
}

/**
 * 更新章节信息（包括内容）
 */
export const updateChapterApi = (chapterId: string, data: Partial<BookChapterResponse>) => {
    return request.put<ApiResponse<BookChapterResponse>>(`/creator/chapters/${chapterId}`, data)
}

/**
 * 删除章节
 */
export const deleteChapterApi = (chapterId: string) => {
    return request.delete<ApiResponse<any>>(`/creator/chapters/${chapterId}`)
}

/**
 * 获取章节编辑详情（包含原始内容）
 */
export const getChapterEditDetailApi = (chapterId: string) => {
    return request.get<ApiResponse<BookChapterResponse>>(`/creator/chapters/${chapterId}`)
}
