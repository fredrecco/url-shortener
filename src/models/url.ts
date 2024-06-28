export interface Url {
  id: string;
  expanded: string;
  shortened: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UrlParams = Omit<Url, "id">;

export type UrlWithout = Omit<Url, "id" | "expanded" | "shortened" | "createdAt" | "updatedAt">;

export type UrlOp =
  UrlWithout &
  Partial<Pick<Url, "id" | "expanded" | "shortened" | "createdAt" | "updatedAt">>;
