/** Backend IResult → { Success, Message } (camelCase serileşir). */
export interface ResponseModel {
  success: boolean;
  message: string;
}

/** Backend IDataResult<T> (tekil) → { Success, Message, Data }. */
export interface DataResponseModel<T> extends ResponseModel {
  data: T;
}

/** Backend IDataResult<T> (dizi) → { Success, Message, Data }. */
export interface ListResponseModel<T> extends ResponseModel {
  data: T[];
}

/** Backend PagedResult<T> — sayfalı liste zarfı ([13 §5]). */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * RFC 7807 problem+json ([13 §8]). Platform API'si hata gövdesini bu şekilde
 * dönebilir; şu an backend çoğu uçta {success,message} zarfını kullanıyor,
 * bu tip ileri fazlar için hazır tutulur.
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
