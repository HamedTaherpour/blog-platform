// Common utility types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ServerSideProps<T = any> {
  props: T;
}

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}
