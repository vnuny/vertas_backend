import { NextFunction } from "express";

export function cusError(
  status: number,
  {
    message,
    errors
  }: {
    message: string;
    errors?: {
      field: string;
      message: string;
    }[];
  }
) {
  throw {
    status,
    message,
    errors
  };
}

export function catchError(err: any, next: NextFunction) {
  if (err.status) {
    return next(err);
  } else {
    return next({
      status: 500,
      message: "Something went wrong, please try again"
    });
  }
}
