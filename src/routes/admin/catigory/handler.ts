import { Request, Response, NextFunction } from "express";
import { GenSlug } from "../../../lib/lib";
import db from "../../../database/connect";
import { catchError } from "../../../utils/errors";
import { CATIGORYS } from "../../../database/schema";
import { eq } from "drizzle-orm";

export async function CreateCatigoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, posterUrl } = req.body;
  try {
    const slug = GenSlug(title);
    const checkSlug = await db.query.CATIGORYS.findFirst({
      where: (catigorys, { eq }) => eq(catigorys.slug, slug)
    });
    if (checkSlug) {
      res.status(400).json({
        message: "Catigory already exists",
        errors: [
          {
            field: "title",
            message: "title is already exists, please use another title"
          }
        ]
      });
      return;
    }
    const newCatigory = await db.insert(CATIGORYS).values({
      title,
      description,
      poster: posterUrl,
      slug
    });
    res.status(200).json({
      message: "Catigory created successfully",
      data: newCatigory
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function UpdateCatigoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, title, description, posterUrl } = req.body;
  try {
    const catigory = await db.query.CATIGORYS.findFirst({
      where: (catigorys, { eq }) => eq(catigorys.id, id)
    });
    if (!catigory) {
      res.status(404).json({
        message: "Catigory not found",
        errors: [
          {
            field: "id",
            message: "Catigory with this id not found"
          }
        ]
      });
      return;
    }
    const newSlug = catigory.title === title ? catigory.slug : GenSlug(title);
    const updatedCatigory = await db
      .update(CATIGORYS)
      .set({
        title,
        description,
        poster: posterUrl,
        slug: newSlug
      })
      .where(eq(CATIGORYS.id, id));

    res.status(200).json({
      message: "Catigory updated successfully"
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function DeleteCatigoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  try {
    const catigory = await db.query.CATIGORYS.findFirst({
      where: (catigorys, { eq }) => eq(catigorys.id, id)
    });
    if (!catigory) {
      res.status(404).json({
        message: "Catigory not found",
        errors: [
          {
            field: "id",
            message: "Catigory with this id not found"
          }
        ]
      });
      return;
    }

    const deletedCatigory = await db
      .delete(CATIGORYS)
      .where(eq(CATIGORYS.id, id));

    res.status(200).json({
      message: "Catigory deleted successfully"
    });
  } catch (error) {
    catchError(error, next);
  }
}
