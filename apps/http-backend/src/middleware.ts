import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] ?? "";
    
    console.log("Auth header received:", authHeader);
    console.log("JWT_SECRET being used:", JWT_SECRET);
    
    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith("Bearer ") 
        ? authHeader.substring(7) 
        : authHeader;

    console.log("Extracted token:", token);

    if (!token) {
        console.log("No token provided");
        res.status(401).json({
            message: "No token provided"
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Token decoded successfully:", decoded);

        if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
            // @ts-ignore: TODO: Fix this
            req.userId = decoded.userId;
            next();
        } else {
            console.log("Token decoded but no userId found");
            res.status(403).json({
                message: "Unauthorized"
            });
        }
    } catch (error) {
        console.log("JWT verification error:", error);
        res.status(401).json({
            message: "Invalid token"
        });
    }
}