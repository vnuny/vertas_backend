import { Router } from "express";
import {
  CreateCatigoryHandler,
  DeleteCatigoryHandler,
  UpdateCatigoryHandler
} from "./catigory/handler";
import AdminCreateCatigoryValidation, {
  AdminDeleteCatigoryValidation,
  AdminUpdateCatigoryValidation
} from "./catigory/validation";
import {
  CreateSubCatigoryHandler,
  DeleteSubCatigoryHandler,
  UpdateSubCatigoryHandler
} from "./subCatigory/handler";
import {
  AdminCreateSubCatigoryValidation,
  AdminDeleteSubCatigoryValidation,
  AdminUpdateSubCatigoryValidation
} from "./subCatigory/validation";
import {
  CreateArticalHandler,
  DeleteArticalHandler,
  UpdateArticalHandler
} from "./artical/handler";
import {
  AdminCreateArticalValidation,
  AdminDeleteArticalValidation,
  AdminUpdateArticalValidation
} from "./artical/validation";
import AuthMiddleware from "./auth/authMiddleware";

const AdminRouter = Router();
// AdminRouter.use(AuthMiddleware);

//Catigorys
AdminRouter.post(
  "/catigory/create",
  AdminCreateCatigoryValidation,
  CreateCatigoryHandler
);
AdminRouter.post(
  "/catigory/update",
  AdminUpdateCatigoryValidation,
  UpdateCatigoryHandler
);
AdminRouter.post(
  "/catigory/delete",
  AdminDeleteCatigoryValidation,
  DeleteCatigoryHandler
);

//Sub Catigorys
AdminRouter.post(
  "/subCatigory/create",
  AdminCreateSubCatigoryValidation,
  CreateSubCatigoryHandler
);
AdminRouter.post(
  "/subCatigory/update",
  AdminUpdateSubCatigoryValidation,
  UpdateSubCatigoryHandler
);
AdminRouter.post(
  "/subCatigory/delete",
  AdminDeleteSubCatigoryValidation,
  DeleteSubCatigoryHandler
);

//articals
AdminRouter.post(
  "/artical/create",
  AdminCreateArticalValidation,
  CreateArticalHandler
);
AdminRouter.post(
  "/artical/update",
  AdminUpdateArticalValidation,
  UpdateArticalHandler
);
AdminRouter.post(
  "/artical/delete",
  AdminDeleteArticalValidation,
  DeleteArticalHandler
);

export default AdminRouter;
