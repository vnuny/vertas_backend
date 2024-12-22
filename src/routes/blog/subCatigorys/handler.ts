import { Request, Response, NextFunction } from "express";
import db from "../../../database/connect";
import { CATIGORYS, SUB_CATIGORYS } from "../../../database/schema";
import { eq } from "drizzle-orm";
import { catchError, cusError } from "../../../utils/errors";
import redis from "../../../database/redis";
import ms from "ms";

export default async function GetSubCatigorysHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { catigory_slug } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  try {
    const cache = await redis.get(
      `subCatigorys:${catigory_slug}:${pageNum}:${limitNum}`
    );
    if (cache) {
      res.status(200).json({
        message: "Sub Categories fetched successfully",
        ...JSON.parse(cache)
      });
      return;
    }
    const catigory = await db.query.CATIGORYS.findFirst({
      where: (catigorys, { eq }) => eq(catigorys.slug, catigory_slug)
    });

    if (!catigory) {
      res.status(404).json({
        message: "Category not found",
        errors: [
          {
            field: "catigorySlug",
            message: "Category with this slug not found"
          }
        ]
      });
      return;
    }

    const [subCatigorys, subCatigorysCount] = await Promise.all([
      db.query.SUB_CATIGORYS.findMany({
        where: (sub_catigorys, { eq }) =>
          eq(sub_catigorys.catigoryId, catigory.id),
        orderBy: (sub_catigorys, { desc }) => desc(sub_catigorys.createdAt),
        limit: limitNum,
        offset: (pageNum - 1) * limitNum
      }),
      db.$count(SUB_CATIGORYS, eq(SUB_CATIGORYS.catigoryId, catigory.id))
    ]);

    redis.setex(
      `subCatigorys:${catigory_slug}:${pageNum}:${limitNum}`,
      ms("1h"),
      JSON.stringify({
        catigory,
        subCatigorys,
        meta: {
          page: pageNum,
          totalPages: Math.ceil(subCatigorysCount / limitNum),
          limit: limitNum,
          total: subCatigorysCount
        }
      })
    );
    res.status(200).json({
      message: "Sub Categories fetched successfully",
      catigory,
      subCatigorys,
      meta: {
        page: pageNum,
        totalPages: Math.ceil(subCatigorysCount / limitNum),
        limit: limitNum,
        total: subCatigorysCount
      }
    });
  } catch (error) {
    catchError(error, next);
  }
}
