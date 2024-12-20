import { Router } from "express";
import LoginHandler from "./login/handler";

const AuthRouter = Router();

AuthRouter.post("/login", LoginHandler);

export default AuthRouter;
