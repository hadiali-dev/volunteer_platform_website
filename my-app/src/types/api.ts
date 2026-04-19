export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: string;
  results: number;
  page: number;
  total: number;
  message?: string;
  data: T[];
}

export class AppError extends Error {
  public readonly status: string;
  public readonly statusCode: number;

  public constructor(
    message: string,
    statusCode: number = 500,
    status: string = "error",
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = status;
  }
}
