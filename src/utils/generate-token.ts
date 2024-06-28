import jwt from "jsonwebtoken";

export const generateToken = <T extends string | object | Buffer>(data: T, secret: string, time: string | number) => {
  const token = jwt.sign(data, secret, { expiresIn: time });

  return token;
};
