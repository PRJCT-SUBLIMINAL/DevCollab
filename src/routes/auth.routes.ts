import {Router} from "express";
import {middlewareCreateUser, middlewareGetUser} from "../middleware.js";

export const authRoute = Router();

authRoute.post("/register", middlewareCreateUser);
authRoute.post("/login", middlewareGetUser);