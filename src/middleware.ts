import {ErrorRequestHandler, Request, Response, NextFunction} from "express";
import {BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError} from "./classes.js";

import {hashPassword, checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken} from "./auth.js";
import {createUser, getUser} from "./db/queries/users.js";
import {storeRefreshToken, findRefreshToken, getUserFromRefreshToken} from "./db/queries/refreshTokens.js";

import {config} from "./config.js";

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
        };

        if (!body?.email || !body?.password) throw new BadRequestError("Missing fields");
        if (!body.email.includes("@")) throw new BadRequestError("Email format must include '@' symbol");

        const hashedPw = await hashPassword(body.password);

        const user = await createUser({email: body.email, hashedPassword: hashedPw });

        if (!user) throw new BadRequestError("Can't create user / user already exists");

        const { hashedPassword, ...userResponse } = user; 

        res.status(201).json(userResponse);
    } catch (err) {
        next(err);
    };
};

export async function middlewareGetUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await getUser(req.body.email);

        if (!user) {
            return next(new UnauthorizedError("Invalid login"));
        }

        const isValid = await checkPasswordHash(req.body.password, user.hashedPassword);

        if (!isValid) {
            return next(new UnauthorizedError("Invalid login"));
        }

        const token = makeJWT(user.id, 3600, config.api.jwtSecret);
        const refreshToken = makeRefreshToken();

        await storeRefreshToken(refreshToken, user.id, 3600 * 24 * 60);

        const { hashedPassword, ...userResponse } = user;
    
        res.status(200).json({...userResponse, token, refreshToken});
    } catch (err) {
        return next(err);
    }
}

export async function middlewareRefreshUser(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const foundRefreshToken = await findRefreshToken(refreshToken);
    if (!foundRefreshToken || (foundRefreshToken.expiresAt < new Date()) || foundRefreshToken.revokedAt) {
        throw new UnauthorizedError("Can not find refresh token");
    }

    const userId = await getUserFromRefreshToken(refreshToken);
    if (!userId) {
        throw new UnauthorizedError("User not authorized");
    }

    const token = makeJWT(userId, 3600, config.api.jwtSecret);

    res.status(200).json({token});
}

export const middlewareErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    const body = { error: err.message };

    if (err instanceof BadRequestError) res.status(400).json(body);
    else if (err instanceof UnauthorizedError) return res.status(401).json(body);
    else if (err instanceof ForbiddenError) return res.status(403).json(body);
    else if (err instanceof NotFoundError) return res.status(404).json(body);
    else return res.status(500).json({ error: "Something went wrong on our end." });
    return;
};