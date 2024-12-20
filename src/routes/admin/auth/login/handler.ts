import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { catchError, cusError } from "../../../../utils/errors";
import jwt from "jsonwebtoken";
import ms from "ms";

const appUsername = process.env.APP_USERNAME as string;
const appPassword = process.env.APP_PASSWORD as string;

export default function LoginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: "validation error",
      errors: [
        {
          field: "username",
          message: "username is required"
        },
        {
          field: "password",
          message: "password is required"
        }
      ]
    });
    return;
  }

  try {
    if (username === appUsername && password === appPassword) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
        expiresIn: ms("1y")
      });
      res.cookie("secToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      });
      res.status(200).json({
        message: "Login successful"
      });
      return;
    } else {
      cusError(401, { message: "Invalid username or password" });
    }
  } catch (error) {
    catchError(error, next);
  }
}
