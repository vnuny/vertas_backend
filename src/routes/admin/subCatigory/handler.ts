import { Request, Response, NextFunction } from "express";
import { GenSlug } from "../../../lib/lib";
import db from "../../../database/connect";
import { catchError } from "../../../utils/errors";
import { CATIGORYS, SUB_CATIGORYS } from "../../../database/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export async function CreateSubCatigoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { catigoryId, title, description, posterUrl } = req.body;
  try {
    const slug = GenSlug(title);
    const checkSlug = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq, and }) =>
        and(
          eq(sub_catigorys.slug, slug),
          eq(sub_catigorys.catigoryId, catigoryId)
        )
    });
    if (checkSlug) {
      res.status(400).json({
        message: "Sub Catigory already exists",
        errors: [
          {
            field: "title",
            message: "title is already exists, please use another title"
          }
        ]
      });
      return;
    }

    const catigory = await db.query.CATIGORYS.findFirst({
      where: (catigorys, { eq }) => eq(catigorys.id, catigoryId)
    });
    if (!catigory) {
      res.status(404).json({
        message: "Catigory not found",
        errors: [
          {
            field: "catigoryId",
            message: "Catigory with this id not found"
          }
        ]
      });
      return;
    }

    const newSubCatigory = await db.insert(SUB_CATIGORYS).values({
      title,
      description,
      poster: posterUrl,
      catigoryId: catigoryId,
      slug
    });
    res.status(200).json({
      message: "Sub Catigory created successfully",
      data: newSubCatigory
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function UpdateSubCatigoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, title, description, posterUrl } = req.body;
  try {
    const subCatigory = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq }) => eq(sub_catigorys.id, id)
    });
    if (!subCatigory) {
      res.status(404).json({
        message: "Sub Catigory not found",
        errors: [
          {
            field: "id",
            message: "Sub Catigory with this id not found"
          }
        ]
      });
      return;
    }
    const newSlug =
      subCatigory.title === title ? subCatigory.slug : GenSlug(title);

    const checkSlug = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq, and }) =>
        and(
          eq(sub_catigorys.slug, newSlug),
          eq(sub_catigorys.catigoryId, subCatigory.catigoryId as string)
        )
    });
    if (checkSlug) {
      res.status(400).json({
        message: "Sub Catigory already exists",
        errors: [
          {
            field: "title",
            message: "title is already exists, please use another title"
          }
        ]
      });
      return;
    }
    const updatedSubCatigory = await db
      .update(SUB_CATIGORYS)
      .set({
        title,
        description,
        poster: posterUrl,
        slug: newSlug
      })
      .where(eq(SUB_CATIGORYS.id, id));

    res.status(200).json({
      message: "Sub Catigory updated successfully",
      data: updatedSubCatigory
    });
  } catch (error) {
    catchError(error, next);
  }
}

export async function DeleteSubCatigoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  try {
    const subCatigory = await db.query.SUB_CATIGORYS.findFirst({
      where: (sub_catigorys, { eq }) => eq(sub_catigorys.id, id)
    });
    if (!subCatigory) {
      res.status(404).json({
        message: "Sub Catigory not found",
        errors: [
          {
            field: "id",
            message: "Sub Catigory with this id not found"
          }
        ]
      });
      return;
    }

    const deletedSubCatigory = await db
      .delete(SUB_CATIGORYS)
      .where(eq(SUB_CATIGORYS.id, id));

    res.status(200).json({
      message: "Sub Catigory deleted successfully"
    });
  } catch (error) {
    catchError(error, next);
  }
}
