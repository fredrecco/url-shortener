import { Response } from "express";

export default class BaseError extends Error {
  constructor(
    public readonly message: string = "Internal server error",
    public readonly statusCode: number = 500
  ) {
    super(message);
    // Error.captureStackTrace(this, this.constructor);
  }
}
