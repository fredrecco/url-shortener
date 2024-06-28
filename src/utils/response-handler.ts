import { Request, Response } from "express";
import { HttpResponse } from "../helpers/http-response/success";
import BaseError from "../helpers/http-response/errors/BaseError";

export const ResponseHandler = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value;

  descriptor.value = async function (req: Request, res: Response) {
    try {
      const { body, statusCode } = await method.apply(this, [req, res]) as HttpResponse<unknown>;

      return res.status(statusCode).send(body);
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
