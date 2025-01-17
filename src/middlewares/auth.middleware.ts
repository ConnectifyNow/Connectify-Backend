import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = (
  token: string,
  callback: (err: any, user: { _id: string }) => void
) => {
  jwt.verify(token, process.env.JWT_SECRET, callback);
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth check for Swagger docs
  if (req.path.startsWith("/api-docs")) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token == null) return res.sendStatus(401);
  verifyToken(token, (error: any, user: { _id: string }) => {
    if (error) return res.sendStatus(401);

    req.user = user;
    next();
  });
};

export default authMiddleware;
