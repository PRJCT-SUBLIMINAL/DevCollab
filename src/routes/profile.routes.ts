import {Router} from "express";
import {middlewareCreateDevProfile, middlewareGetDevProfile, middlewareAuth} from "../middleware.js";

export const profileRoute = Router();

profileRoute.post("/create", middlewareAuth, middlewareCreateDevProfile);
profileRoute.post("/get", middlewareGetDevProfile);