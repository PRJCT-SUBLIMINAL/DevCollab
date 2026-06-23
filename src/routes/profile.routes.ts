import {Router} from "express";
import {middlewareCreateDevProfile, middlewareGetDevProfile, middlewareUpdateDevProfile, middlewareAuth} from "../middleware.js";

export const profileRoute = Router();

profileRoute.post("/create", middlewareAuth, middlewareCreateDevProfile);
profileRoute.post("/get", middlewareGetDevProfile);
profileRoute.post("/update", middlewareAuth, middlewareUpdateDevProfile);
profileRoute.post("/delete", middlewareAuth);