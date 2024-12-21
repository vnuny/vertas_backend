import { Request, Response, NextFunction } from "express";
import { GenSlug } from "../../../lib/lib";
import db from "../../../database/connect";
import { catchError } from "../../../utils/errors";
import { CATIGORYS, ARTICALS } from "../../../database/schema";
import { eq } from "drizzle-orm";

export async function CreateArticalHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    title,
    description,
    subCatigoryId,
    cardPosterUrl,
    cardTitle,
    cardDescription,
    tags,
    blocks
  } = req.body;

  try {
    const subCatigory = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq }) => eq(sub_catigorys.id, subCatigoryId)
    });
    if (!subCatigory) {
      res.status(404).json({
        message: "Sub Catigory not found",
        errors: [
          {
            field: "subCatigoryId",
            message: "Sub Catigory with this id not found"
          }
        ]
      });
      return;
    }

    const slug = GenSlug(cardTitle);
    const checkSlug = await db.query.ARTICALS.findFirst({
      where: (articals, { eq }) => eq(articals.slug, slug)
    });
    if (checkSlug) {
      res.status(400).json({
        message: "Artical already exists",
        errors: [
          {
            field: "cardTitle",
            message: "title is already exists, please use another title"
          }
        ]
      });
      return;
    }

    const newArtical = await db.insert(ARTICALS).values({
      title,
      description,
      subCatigoryId,
      cardTitle,
      cardDescription,
      cardPoster: cardPosterUrl,
      tags,
      slug,
      blocks
    });
    res.status(200).json({
      message: "Artical created successfully",
      data: newArtical
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function UpdateArticalHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    id,
    title,
    description,
    cardPosterUrl,
    cardTitle,
    cardDescription,
    tags,
    blocks
  } = req.body;

  try {
    const artical = await db.query.ARTICALS.findFirst({
      where: (articals, { eq }) => eq(articals.id, id)
    });
    if (!artical) {
      res.status(404).json({
        message: "Artical not found",
        errors: [
          {
            field: "id",
            message: "Artical with this id not found"
          }
        ]
      });
      return;
    }

    const slug = title === artical.title ? artical.slug : GenSlug(cardTitle);
    const checkSlug = await db.query.ARTICALS.findFirst({
      where: (articals, { eq, and }) =>
        and(eq(articals.slug, slug), eq(articals.id, id))
    });
    if (checkSlug) {
      res.status(400).json({
        message: "Artical already exists",
        errors: [
          {
            field: "cardTitle",
            message: "title is already exists, please use another title"
          }
        ]
      });
      return;
    }
    const updatedArtical = await db.update(ARTICALS).set({
      title,
      description,
      cardTitle,
      cardDescription,
      cardPoster: cardPosterUrl,
      tags,
      slug,
      blocks
    });
    res.status(200).json({
      message: "Artical updated successfully",
      data: updatedArtical
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function DeleteArticalHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  try {
    const artical = await db.query.ARTICALS.findFirst({
      where: (articals, { eq }) => eq(articals.id, id)
    });
    if (!artical) {
      res.status(404).json({
        message: "Artical not found",
        errors: [
          {
            field: "id",
            message: "Artical with this id not found"
          }
        ]
      });
      return;
    }

    const deletedArtical = await db.delete(ARTICALS).where(eq(ARTICALS.id, id));

    res.status(200).json({
      message: "Artical deleted successfully"
    });
  } catch (error) {
    catchError(error, next);
  }
}
