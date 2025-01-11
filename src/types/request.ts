import * as express from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: { _id: string }; // Make user property optional
    }
  }
}
