import { Request, Response } from "express";
import BadRequest from "../helpers/http-response/errors/BadRequest";
import { validateToken } from "../utils/validate-token";
import Unauthorized from "../helpers/http-response/errors/Unauthorized";
import BaseError from "../helpers/http-response/errors/BaseError";
import { userRecoverRepository } from "../repositories/user-recover-repository";
import { getEnv } from "../utils/env";

export const Recover = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value;

  descriptor.value = async function (req: Request<{ token: string }, unknown, unknown>, res: Response) {
    try {
      const { token } = req.params;

      if (!token) {
        throw new BadRequest("Missing token.");
      }

      const isValidToken = await userRecoverRepository.findByToken(token);

      if (!isValidToken || isValidToken.used) {
        throw new Unauthorized("Invalid token.");
      }

      const payload = validateToken(token, getEnv("SECRET_RECOVER"));

      if (!payload) {
        throw new Unauthorized("Invalid token.");
      }

      req.user = payload;
      req.token = token;

      return await method.apply(this, [req, res]);
    } catch (error) {
      return res
        .status((error as BaseError).statusCode)
        .send({
          message: (error as BaseError).message,
          statusCode: (error as BaseError).statusCode
        });
    }
  };
}
