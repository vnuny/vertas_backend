import express, { Router } from "express";
import multer from "multer";
import uploadImages, { UPLOAD } from "../images/upload/handler";
import ImagesGallery from "./gallery/handler";
import DeleteImageHandler from "./delete/handler";
import AuthMiddleware from "../auth/authMiddleware";
const ImagesRouter = Router();

ImagesRouter.use("/q", express.static("public/images"));
ImagesRouter.post(
  "/upload",
  AuthMiddleware,
  UPLOAD.single("image"),
  uploadImages
);
ImagesRouter.get("/gallery", AuthMiddleware, ImagesGallery);
ImagesRouter.post("/delete", AuthMiddleware, DeleteImageHandler);
export default ImagesRouter;
