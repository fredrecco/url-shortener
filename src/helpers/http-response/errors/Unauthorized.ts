import BaseError from "./BaseError";

export default class Unauthorized extends BaseError {
  constructor(message: string, code: number = 401) {
    super(message, code);
  }
}
