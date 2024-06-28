export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  verified: boolean;
}

export type UserParams = Omit<User, "id">;
export type UserParamsService = Omit<UserParams, "createdAt" | "verified">;

type UserWithout = Omit<User, "id" | "name" | "email" | "password" | "createdAt" | "verified">;

export type UserOp =
  UserWithout &
  Partial<Pick<User, "id" | "name" | "email" | "password" | "createdAt" | "verified">>;
