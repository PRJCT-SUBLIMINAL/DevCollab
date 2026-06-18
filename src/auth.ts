import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken";
import * as crypto from "crypto";
import type {Request} from "express";
import {UnauthorizedError} from "./classes.js";

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);
    if (!hashedPassword) throw new UnauthorizedError("Can not has password");
    return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        const isVerified = await argon2.verify(hash, password);
        return isVerified;
    } catch {
        throw new UnauthorizedError("Failed to check password hash");
    };
};

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userId: string, expiresIn: number, secret: string): string {
    const currentTime = Math.floor(Date.now() / 1000);
    const expireTime = currentTime + expiresIn;

    const token = jwt.sign({
        iss: "devcollab",
        sub: userId,
        iat: currentTime,
        exp: expireTime
    } satisfies Payload, secret);

    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    let decodedPassword: JwtPayload;
    try {
        decodedPassword = jwt.verify(tokenString, secret) as JwtPayload;
    } catch {
        throw new UnauthorizedError("Unable to validate password");
    }


    if(!decodedPassword.sub) throw new UnauthorizedError("No user ID in token");

    return decodedPassword.sub;
}

export function getBearerToken(req: Request): string {
    const token = req.get("Authorization");
    if (!token) throw new UnauthorizedError("Failed to auth");
    const strippedToken = token.replace("Bearer ", "").trim();
    return strippedToken;
}

export function makeRefreshToken(): string {
    const randomBytes = crypto.randomBytes(32);
    const hexString = randomBytes.toString("hex");
    return hexString;
}

export function getAPIKey(req: Request): string {
    const apiKey = req.get("Authorization");
    if (!apiKey) throw new UnauthorizedError("Failed to auth");
    const strippedAPIKey = apiKey.replace("ApiKey", "").trim();
    return strippedAPIKey;
}