import db from "../../../../database/connect";
import { Request, Response, NextFunction } from "express";
import { catchError } from "../../../../utils/errors";
import { eq } from "drizzle-orm";
import fs from "fs";
import { cusError } from "../../../../utils/errors";
export default async function DeleteImageHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { url } = req.body;
    const imageName = url.split("/").pop();
    const del = await fs.unlinkSync(`public/images/${imageName}`);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    catchError(error, next);
  }
}
