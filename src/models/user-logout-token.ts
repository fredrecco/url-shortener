export interface UserLogoutToken {
  id: string;
  token: string;
  disconnected: boolean;
  disconnectedAt: Date
}

export type UserLogoutTokenParams = Omit<UserLogoutToken, "id">;