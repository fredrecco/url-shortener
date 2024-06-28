import { Request, Response } from "express";
import { validateToken } from "../utils/validate-token";
import Unauthorized from "../helpers/http-response/errors/Unauthorized";
import BaseError from "../helpers/http-response/errors/BaseError";
import BadRequest from "../helpers/http-response/errors/BadRequest";
import { userLogoutTokenRepository } from "../repositories/user-logout-token-repository";
import { getEnv } from "../utils/env";

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
    token?: any;
  }
}

export const Authorization = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value;

  descriptor.value = async function (req: Request, res: Response) {
    try {
      const auth = req.headers.authorization;
      const token = auth && auth.split(" ")[1];

      if (!token) {
        throw new BadRequest("Missing token.");
      }

      const isValidToken = await userLogoutTokenRepository.findByToken(token);

      if (isValidToken) {
        throw new Unauthorized("Invalid token.");
      }

      const payload = validateToken(token, getEnv("SECRET"));

      if (!payload) {
        throw new Unauthorized("Invalid token.");
      }
      
      req.user = payload;

      return await method.apply(this, [req, res]);
    } catch (error) {
      return res
        .status((error as BaseError).statusCode)
        .send({
          message: (error as BaseError).message,
          statusCode: (error as BaseError).statusCode
        });
    }
  }
};
