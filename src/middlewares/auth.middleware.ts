import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = (
  token: string,
  callback: (err: any, user: { _id: string }) => void
) => {
  jwt.verify(token, JWT_SECRET);
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token == null) return res.sendStatus(401);
  verifyToken(token, (err: any, user: { _id: string }) => {
    if (err) return res.sendStatus(401);

    req.user = user;
    next();
  });
};

export default authMiddleware;
