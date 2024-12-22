import { Request, Response, NextFunction } from "express";
import db from "../../../database/connect";
import { CATIGORYS } from "../../../database/schema";
import redis from "../../../database/redis";
import ms from "ms";

export default async function GetCatigorysHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { page, limit } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  try {
    const cache = await redis.get(`catigorys:${pageNum}:${limitNum}`);
    if (cache) {
      res.status(200).json({
        message: "Catigorys fetched successfully",
        ...JSON.parse(cache)
      });
      return;
    }
    const catigorys = await db.query.CATIGORYS.findMany({
      orderBy: (catigorys, { desc }) => desc(catigorys.createdAt),
      limit: limitNum,
      offset: (pageNum - 1) * limitNum
    });
    const total = await db.$count(CATIGORYS);
    await redis.setex(
      `catigorys:${pageNum}:${limitNum}`,
      ms("1h"),
      JSON.stringify({
        catigorys,
        meta: {
          page: pageNum,
          totalPages: Math.ceil(total / limitNum),
          limit: limitNum,
          total: total
        }
      })
    );
    res.status(200).json({
      message: "Catigorys fetched successfully",
      catigorys,
      meta: {
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum,
        total: total
      }
    });
  } catch (error) {
    next(error);
  }
}
