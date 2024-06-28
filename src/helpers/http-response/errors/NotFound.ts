import BaseError from "./BaseError";

export default class NotFound extends BaseError {
  constructor(message: string, code: number = 404) {
    super(message, code);
  }
}
