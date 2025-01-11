import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import PostModel, { IPost } from "../models/post";
import { BaseController } from "./base.controller";

export class PostController extends BaseController<IPost> {
  constructor(model: Model<IPost>) {
    super(model);
  }

  getPostsOverview = async (req: Request, res: Response) => {
    if (req.params.id) {
      return postController.getById(req, res, ["_id", "title","content", "userId", "date", "comments", "requiredSkills", "likes"]);
    }
    return postController.getAll(req, res, ["_id", "title","content", "userId", "date", "comments", "requiredSkills", "likes"]);
  };

}

const postController = new PostController(PostModel);

export default postController;
