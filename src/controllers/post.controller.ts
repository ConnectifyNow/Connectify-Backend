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
      return postController.getById(req, res, [
        "_id",
        "title",
        "content",
        "userId",
        "date",
        "comments",
        "requiredSkills",
        "likes",
      ]);
    }
    return postController.getAll(req, res, [
      "_id",
      "title",
      "content",
      "userId",
      "date",
      "comments",
      "requiredSkills",
      "likes",
    ]);
  };

  getPostsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!mongoose.Types.UUID.isValid(userId)) {
        return res.status(400).send({ error: "Invalid user id format" });
      }
      if (!userId) {
        return res.status(400).send({ error: "User id is required" });
      }
      const posts = await PostModel.find({ userId });
      if (!posts) {
        return res.status(404).json({ message: "Posts not found" });
      }
      return res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const postController = new PostController(PostModel);

export default postController;
