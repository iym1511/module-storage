export interface Board {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at?: string;
    author_id: string;
    author_email: string;
    author_name?: string;
}

export interface CreateBoardRequest {
    title: string;
    content: string;
}

export interface UpdateBoardRequest {
    title: string;
    content: string;
}
