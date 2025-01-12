import UserModel, { IUser } from "../models/user";
import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Model } from "mongoose";

export class UserController extends BaseController<IUser> {
  constructor(model: Model<IUser>) {
    super(model);
  }

  getUserOverview = async (req: Request, res: Response) => {
    if (req.params.id) {
      return userController.getById(req, res, [
        "_id",
        "name",
        "email",
        //   "image",
        "bio",
        "type"
      ]);
    }
    return userController.getAll(req, res, [
      "_id",
      "name",
      "email",
      // "image",
      "bio",
      "type"
    ]);
  };
}
const userController = new UserController(UserModel);
export default userController;
