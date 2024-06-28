import { config } from "dotenv";
import BaseError from "../helpers/http-response/errors/BaseError";

config();

type EnvNames =
  "PORT" | "SECRET" | "SECRET_ADMIN" | "KEY" | "MAIL_USER" | "MAIL_PASS" | "BASE_URL" | "VERIFY_ROUTE" | "RECOVER_ROUTE" | "SECRET_RECOVER" | "SECRET_VERIFY";

export const getEnv = (name: EnvNames) => {
  const env = process.env[name];

  if (!env) {
    throw new BaseError("Internal server error.");
  }

  return env;
};
