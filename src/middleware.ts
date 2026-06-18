import {ErrorRequestHandler, Request, Response, NextFunction} from "express";
import {BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError} from "./classes.js";

import {hashPassword} from "./auth.js";
import {createUser} from "./db/queries/users.js";

export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        };
    });
    next();
};

export async function middlewareCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;

        if (!body) {
            res.status(400).json({error: "Something went wrong"});
            return;
        }

        if (!body?.email || !body?.password) throw new BadRequestError("Missing fields");
        if (!body.email.includes("@")) throw new BadRequestError("Email format must include '@' symbol");

        const hashedPw = await hashPassword(body.password);

        const user = await createUser({email: body.email, hashedPassword: hashedPw });

        if (!user) throw new BadRequestError("Can't create user / user already exists");

        const { hashedPassword, ...userResponse } = user; 

        res.status(201).json(userResponse);
    } catch (err) {
        next(err);
    }
    
}

export const middlewareErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    const body = { error: err.message };
    if (err instanceof BadRequestError) {
        res.status(400).json(body);
    } else if (err instanceof UnauthorizedError) {
        return res.status(401).json(body);
    } else if (err instanceof ForbiddenError) {
        return res.status(403).json(body);
    } else if (err instanceof NotFoundError) {
        return res.status(404).json(body);
    } else {
        return res.status(500).json({ error: "Something went wrong on our end." });
    }
    return;
}