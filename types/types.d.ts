export interface Ele {
    id: number
    title: string
    desc: string
    link_logo: string
    link: string
    link_origin: string
    num_order: number
    keywords?: string[]
    is_accessible: boolean
    created_at: string
    updated_at: string
}

export interface Page {
    page: number
    page_size: number
}