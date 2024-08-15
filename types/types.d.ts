export interface Ele {
    id: number
    title: string
    desc: string
    category_id: number
    category_title: string
    link_logo: string
    link: string
    link_origin: string
    num_order: number
    keywords?: string[]
    is_accessible: boolean
    created_at: string
    updated_at: string
}

export interface Category {
    id: number
    title: string
    num_order: number
    created_at: string
    updated_at: string
}

export interface Page {
    page: number
    page_size: number
}