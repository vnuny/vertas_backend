import z from "zod";
import { NextFunction, Request, Response } from "express";

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
