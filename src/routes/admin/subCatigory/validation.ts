import z from "zod";
import { NextFunction, Request, Response } from "express";

export async function AdminCreateSubCatigoryValidation(
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
  catigoryId: z
    .string()
    .uuid({ message: "Catigory ID must be a valid UUID" })
    .min(1, { message: "Catigory ID is required" }),
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
  posterUrl: z
    .string({ message: "Poster URL is required" })
    .url({ message: "Invalid URL" })
    .min(1, {
      message: "Poster URL is required"
    })
    .max(500, {
      message: "Poster URL must be less than 500 characters"
    })
});

export async function AdminUpdateSubCatigoryValidation(
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
  posterUrl: z
    .string({ message: "Poster URL is required" })
    .url({ message: "Invalid URL" })
    .min(1, {
      message: "Poster URL is required"
    })
    .max(500, {
      message: "Poster URL must be less than 500 characters"
    })
});

export async function AdminDeleteSubCatigoryValidation(
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
