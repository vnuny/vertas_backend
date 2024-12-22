import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { catchError } from "../../../../utils/errors";
export default async function ImagesGallery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { limit, page } = req.query;

  const limitNum = parseInt(limit as string) || 40;
  const pageNum = parseInt(page as string) || 1;
  try {
    const images = await fs.readdirSync("public/images");
    const modifiedImages = images.map((image) => ({
      url: `${process.env.BASE_URL}/images/q/${image}`
    }));
    res.status(200).json({
      message: "Images gallery",
      images: modifiedImages,
      meta: {
        limit: limitNum,
        page: pageNum,
        totalPages: Math.ceil(modifiedImages.length / limitNum),
        total: modifiedImages.length
      }
    });
  } catch (error) {
    console.log(error);
    catchError(error, next);
  }
}
