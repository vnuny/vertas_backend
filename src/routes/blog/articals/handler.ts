import { Request, Response, NextFunction } from "express";
import db from "../../../database/connect";
import { ARTICALS } from "../../../database/schema";
import { eq } from "drizzle-orm";
import { catchError } from "../../../utils/errors";
import redis from "../../../database/redis";
import ms from "ms";

export default async function GetArticalsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { catigory_slug, sub_catigory_slug } = req.params;
  console.log(catigory_slug, sub_catigory_slug);
  const { page, limit } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  try {
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

    const subCatigory = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq }) =>
        eq(sub_catigorys.slug, sub_catigory_slug)
    });

    if (!subCatigory) {
      res.status(404).json({
        message: "Sub Category not found",
        errors: [
          {
            field: "subCatigorySlug",
            message: "Sub Category with this slug not found"
          }
        ]
      });
      return;
    } else if (subCatigory.catigoryId !== catigory.id) {
      res.status(404).json({
        message: "Sub Category not found",
        errors: [
          {
            field: "subCatigorySlug",
            message: "Sub Category with this slug not found"
          }
        ]
      });
      return;
    }

    const articals = await db.query.ARTICALS.findMany({
      where: (articals, { eq }) => eq(articals.subCatigoryId, subCatigory.id),
      orderBy: (articals, { desc }) => desc(articals.createdAt),
      limit: limitNum,
      offset: (pageNum - 1) * limitNum
    });

    const articalsCount = await db.$count(
      ARTICALS,
      eq(ARTICALS.subCatigoryId, subCatigory.id)
    );

    res.status(200).json({
      message: "Artical fetched successfully",
      catigory: catigory,
      subCatigory: subCatigory,
      articals: articals,
      meta: {
        page: pageNum,
        totalPages: Math.ceil(articalsCount / limitNum),
        limit: limitNum,
        total: articalsCount
      }
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function GetArticalHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { catigory_slug, sub_catigory_slug, artical_slug } = req.params;
  const { suggestionsLimit } = req.query;
  try {
    const cache = await redis.get(`artical:${artical_slug}`);
    if (cache) {
      res.status(200).json({
        message: "Artical fetched successfully",
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

    const subCatigory = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq }) =>
        eq(sub_catigorys.slug, sub_catigory_slug)
    });

    if (!subCatigory) {
      res.status(404).json({
        message: "Sub Category not found",
        errors: [
          {
            field: "subCatigorySlug",
            message: "Sub Category with this slug not found"
          }
        ]
      });
      return;
    } else if (subCatigory.catigoryId !== catigory.id) {
      res.status(404).json({
        message: "Sub Category not found",
        errors: [
          {
            field: "subCatigorySlug",
            message: "Sub Category with this slug not found"
          }
        ]
      });
      return;
    }

    const [artical, suggestedArticals] = await Promise.all([
      db.query.ARTICALS.findFirst({
        where: (articals, { eq }) => eq(articals.slug, artical_slug)
      }),
      db.query.ARTICALS.findMany({
        where: (articals, { eq }) => eq(articals.subCatigoryId, subCatigory.id),
        orderBy: (articals, { desc }) => desc(articals.createdAt),
        limit: parseInt(suggestionsLimit as string) || 4
      })
    ]);
    if (!artical) {
      res.status(404).json({
        message: "Artical not found",
        errors: [
          {
            field: "articalSlug",
            message: "Artical with this slug not found"
          }
        ]
      });
      return;
    } else if (artical.subCatigoryId !== subCatigory.id) {
      res.status(404).json({
        message: "Artical not found",
        errors: [
          {
            field: "articalSlug",
            message: "Artical with this slug not found"
          }
        ]
      });
      return;
    }

    await redis.setex(
      `artical:${artical.slug}`,
      ms("1h"),
      JSON.stringify({
        catigory,
        subCatigory,
        artical
      })
    );

    res.status(200).json({
      message: "Artical fetched successfully",
      catigory: catigory,
      subCatigory: subCatigory,
      artical: artical
    });
  } catch (error) {
    catchError(error, next);
  }
}
