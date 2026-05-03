export interface ApiError extends Error {
  statusCode: number | null;
  url: string;
  method: string;
  errorCode: string | null;
  message: string;
  raw: unknown;
}

export function createApiError(params: {
  statusCode: number | null;
  url: string;
  method: string;
  errorCode?: string | null;
  message: string;
  raw?: unknown;
}): ApiError {
  const error = new Error(params.message) as ApiError;
  error.name = 'ApiError';
  error.statusCode = params.statusCode;
  error.url = params.url;
  error.method = params.method;
  error.errorCode = params.errorCode ?? null;
  error.raw = params.raw ?? null;
  return error;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && error.name === 'ApiError';
}
