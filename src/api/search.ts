import request from './request'
import type { ApiResponse } from './request'
import type { BookResponse, BookChapterResponse } from './book'

export interface SearchParams {
    query?: string
    vip_level?: string 
    // 书籍参数
    price_start?: number
    price_end?: number
    thermal_value_start?: number
    thermal_value_end?: number 
    push_start_time?: string 
    push_end_time?: string 
    update_start_time?: string 
    update_end_time?: string
    owner_id?: string
    bookshelf_amount_start?: number
    bookshelf_amount_end?: number
    order?: string
    order_direction?: string
    // 章节参数
    book_id?: string
    created_at_start?: string
    created_at_end?: string
    
    last_id?: string
    limit?: number
}

export interface BookSearchItem {
    book: BookResponse
    highlight: { description?: string; name?: string }
}

export interface ChapterSearchItem {
    book_chapter: BookChapterResponse
    highlight: { title?: string; content?: string }
}

export interface BookSearchResponse {
    books: BookSearchItem[]
}

export interface ChapterSearchResponse {
    chapters: ChapterSearchItem[]
}

export const searchBooksApi = (params: SearchParams) => {
    return request.get<ApiResponse<BookSearchResponse>>('/books/search', { baseURL: '/api/v2', params })
}

export const searchChaptersApi = (params: SearchParams) => {
    return request.get<ApiResponse<ChapterSearchResponse>>('/chapters/search', { baseURL: '/api/v2', params })
}