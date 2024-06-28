export interface UserValidation {
  id: string;
  token: string;
  userId: string;
}

export type UserValidationParams = Omit<UserValidation, "id">;