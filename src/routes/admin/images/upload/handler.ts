import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const id = uuidv4();
    const ext = file.originalname.split(".").pop();
    cb(null, id + "." + ext);
  }
});

export const UPLOAD = multer({ storage: storage });
export default function uploadImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const imageUrl = `${process.env.BASE_URL}/images/q/${file.filename}`;
  res.status(200).json({ imageUrl });
}
