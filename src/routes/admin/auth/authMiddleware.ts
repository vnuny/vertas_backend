import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cusError } from "../../../utils/errors";

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.secToken;
  if (!token) {
    cusError(401, {
      message: "Unauthorized",
      errors: [
        {
          field: "token",
          message: "token is required"
        }
      ]
    });
  }

  const verify = SafeVerifyToken(token);
  if (!verify) {
    return cusError(401, {
      message: "Unauthorized",
      errors: [
        {
          field: "token",
          message: "token is invalid"
        }
      ]
    });
  }
  next();
}

async function SafeVerifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    return null;
  }
}
