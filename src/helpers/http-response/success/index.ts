export interface HttpResponse<T> {
  body: T,
  statusCode: number;
}

export const ok = <T>(body: T): HttpResponse<T> => {
  return {
    body,
    statusCode: 200
  };
};

export const created = <T>(body: T): HttpResponse<T> => {
  return {
    body,
    statusCode: 201
  };
};
