import request from './request'
import type { ApiResponse } from './request'

export interface BookResponse {
    id: string
    name: string
    description: string
    cover_image: string
    owner_id: string
    created_at: string
    updated_at: string
    push_at: string
    browse_amount: number
    bookshelf_amount: number
    price: number
    vip_level: string
}

export interface BookChapterResponse {
    chapter_id: string
    title: string
    content?: string
    order: number
    vip_level: string
    price: number
    Book?: BookResponse
}

export interface BuyChapterRequest {
    book_id: string
    chapter_id: string
    price: number
}

export interface BookListResponse {
    books: BookResponse[]
    count: number
    page: number
    size: number
}

export interface BookListParams {
    page?: number
    size?: number
    sort_key?: 'browse_amount' | 'bookshelf_amount' | 'new_update' | 'new_push'
    sort_order?: 'asc' | 'desc'
    push_start_time?: string
    push_end_time?: string
}

/**
 * 获取书籍列表
 */
export const getBookListApi = (params: BookListParams) => {
    return request.get<ApiResponse<BookListResponse>>('/books/list', { params })
}

/**
 * 获取书籍详情
 */
export const getBookDetailApi = (id: string) => {
    return request.get<ApiResponse<BookResponse>>(`/books/${id}`)
}

/**
 * 获取书籍章节列表
 */
export const getBookChaptersApi = (id: string) => {
    return request.get<ApiResponse<{ Chapters: BookChapterResponse[] }>>(`/books/${id}/chapters/list`)
}

/**
 * 获取章节内容（认证）
 */
export const getChapterDetailApi = (id: string) => {
    return request.get<ApiResponse<BookChapterResponse>>(`/chapters/${id}`)
}

/**
 * 获取章节内容（游客）
 */
export const getChapterDetailGuestApi = (id: string) => {
    return request.get<ApiResponse<BookChapterResponse>>(`/chapters/${id}/guest`)
}

/**
 * 购买章节
 */
export const buyChapterApi = (data: BuyChapterRequest) => {
    return request.post<ApiResponse<string>>('/buy/chapter', data)
}
