export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    totalCount?: number;
    errors?: string[];
}