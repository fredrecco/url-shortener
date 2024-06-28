import BaseError from "./BaseError";

export default class BadRequest extends BaseError {
  constructor(message: string, code: number = 400) {
    super(message, code);
  }
}
