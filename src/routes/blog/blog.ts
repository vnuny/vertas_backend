import { Router } from "express";
import GetCatigorysHandler from "./catigorys/handler";
import GetSubCatigorysHandler from "./subCatigorys/handler";
import GetArticalsHandler, { GetArticalHandler } from "./articals/handler";
const BlogRouter = Router();

BlogRouter.get("/", GetCatigorysHandler);
BlogRouter.get("/:catigory_slug", GetSubCatigorysHandler);
BlogRouter.get("/:catigory_slug/:sub_catigory_slug", GetArticalsHandler);
BlogRouter.get(
  "/:catigory_slug/:sub_catigory_slug/:artical_slug",
  GetArticalHandler
);
export default BlogRouter;
