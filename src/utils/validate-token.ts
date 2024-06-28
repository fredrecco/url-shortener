import jwt from "jsonwebtoken";

export const validateToken = (token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret);

    return payload;
  } catch (_) {
    return false;
  }
};
