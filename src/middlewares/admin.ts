import { Request, Response } from "express";
import BadRequest from "../helpers/http-response/errors/BadRequest";
import { validateToken } from "../utils/validate-token";
import Unauthorized from "../helpers/http-response/errors/Unauthorized";
import BaseError from "../helpers/http-response/errors/BaseError";
import { getEnv } from "../utils/env";

export const Admin = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value;

  descriptor.value = async function (req: Request, res: Response) {
    try {
      const auth = req.headers.authorization;
      const token = auth && auth.split(" ")[1];

      if (!token) {
        throw new BadRequest("Missing token.");
      }

      const payload = validateToken(token, getEnv("SECRET_ADMIN"));

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
  };
};
