/** Backend IResult → { Success, Message } (serialized as camelCase). */
export interface ResponseModel {
  success: boolean;
  message: string;
}

/** Backend IDataResult<T> (single) → { Success, Message, Data }. */
export interface DataResponseModel<T> extends ResponseModel {
  data: T;
}

/** Backend IDataResult<T> (array) → { Success, Message, Data }. */
export interface ListResponseModel<T> extends ResponseModel {
  data: T[];
}

/** Backend PagedResult<T> — paged list envelope ([13 §5]). */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * RFC 7807 problem+json ([13 §8]). The Platform API may return its error body in this
 * shape; currently the backend uses the {success,message} envelope on most endpoints,
 * so this type is kept ready for later phases.
 */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  correlationId?: string;
  errors?: Record<string, string[]>;
}
