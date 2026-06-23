import {Router} from "express";
import {middlewareCreateDevProfile, middlewareGetDevProfile, middlewareUpdateDevProfile, middlewareDeleteDevProfile, middlewareAuth} from "../middleware.js";

export const profileRoute = Router();

profileRoute.post("/create", middlewareAuth, middlewareCreateDevProfile);
profileRoute.post("/update", middlewareAuth, middlewareUpdateDevProfile);
profileRoute.post("/delete", middlewareAuth, middlewareDeleteDevProfile);

profileRoute.get("/get/:username", middlewareGetDevProfile);