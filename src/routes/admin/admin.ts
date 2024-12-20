import { Router } from "express";
import {
  CreateCatigoryHandler,
  DeleteCatigoryHandler,
  UpdateCatigoryHandler
} from "./catigory/handler";
import AuthMiddleware from "./auth/authMiddleware";
import AdminCreateCatigoryValidation, {
  AdminDeleteCatigoryValidation,
  AdminUpdateCatigoryValidation
} from "./catigory/validation";
import AuthRouter from "./auth/auth";
import { CreateSubCatigoryHandler } from "./subCatigory/handler";

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
AdminRouter.post("/subCatigory/create", CreateSubCatigoryHandler);
AdminRouter.post("/subCatigory/update", UpdateCatigoryHandler);

export default AdminRouter;
