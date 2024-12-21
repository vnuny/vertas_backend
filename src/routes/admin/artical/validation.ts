import z from "zod";
import { NextFunction, Request, Response } from "express";

export async function AdminCreateArticalValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await createSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path[0] as string,
        message: err.message
      }));
      res.status(400).json({
        message: "Validation error",
        errors: errors
      });
    } else {
      next(error);
    }
  }
}

const createSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" })
    .max(255, {
      message: "Title must be less than 255 characters"
    }),
  description: z
    .string({ message: "Description is required" })
    .min(1, { message: "Description is required" })
    .max(500, {
      message: "Description must be less than 500 characters"
    }),
  subCatigoryId: z
    .string()
    .uuid({ message: "Sub Catigory ID must be a valid UUID" })
    .min(1, { message: "Sub Catigory ID is required" }),
  cardPosterUrl: z
    .string({ message: "Card Poster URL is required" })
    .url({ message: "Invalid URL" })
    .min(1, {
      message: "Card Poster URL is required"
    })
    .max(500, {
      message: "Card Poster URL must be less than 500 characters"
    }),
  cardTitle: z
    .string({ message: "Card Title is required" })
    .min(1, { message: "Card Title is required" })
    .max(255, {
      message: "Card Title must be less than 255 characters"
    }),
  cardDescription: z
    .string({ message: "Card Description is required" })
    .min(1, { message: "Card Description is required" })
    .max(500, {
      message: "Card Description must be less than 500 characters"
    }),
  blocks: z.any().refine((val) => val !== undefined, {
    message: "Blocks is required"
  }),
  tags: z
    .array(z.string())
    .min(1, { message: "Tags is required" })
    .refine((val) => val.every((tag) => tag.length <= 255), {
      message: "Each tag must be less than 255 characters"
    })
});

export async function AdminUpdateArticalValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await updateSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path[0] as string,
        message: err.message
      }));
      res.status(400).json({
        message: "Validation error",
        errors: errors
      });
    } else {
      next(error);
    }
  }
}

const updateSchema = z.object({
  id: z
    .string()
    .uuid({ message: "ID must be a valid UUID" })
    .min(1, { message: "ID is required" }),
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" })
    .max(255, {
      message: "Title must be less than 255 characters"
    }),
  description: z
    .string({ message: "Description is required" })
    .min(1, { message: "Description is required" })
    .max(500, {
      message: "Description must be less than 500 characters"
    }),
  cardPosterUrl: z
    .string({ message: "Card Poster URL is required" })
    .url({ message: "Invalid URL" })
    .min(1, {
      message: "Card Poster URL is required"
    })
    .max(500, {
      message: "Card Poster URL must be less than 500 characters"
    }),
  cardTitle: z
    .string({ message: "Card Title is required" })
    .min(1, { message: "Card Title is required" })
    .max(255, {
      message: "Card Title must be less than 255 characters"
    }),
  cardDescription: z
    .string({ message: "Card Description is required" })
    .min(1, { message: "Card Description is required" })
    .max(500, {
      message: "Card Description must be less than 500 characters"
    }),
  blocks: z.any().refine((val) => val !== undefined, {
    message: "Blocks is required"
  }),
  tags: z
    .array(z.string())
    .min(1, { message: "Tags is required" })
    .refine((val) => val.every((tag) => tag.length <= 255), {
      message: "Each tag must be less than 255 characters"
    })
});

export async function AdminDeleteArticalValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path[0] as string,
        message: err.message
      }));
      res.status(400).json({
        message: "Validation error",
        errors: errors
      });
    } else {
      next(error);
    }
  }
}

const deleteSchema = z.object({
  id: z
    .string()
    .uuid({ message: "ID must be a valid UUID" })
    .min(1, { message: "ID is required" })
});
