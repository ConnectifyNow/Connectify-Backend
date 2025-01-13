import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import CommentModel, { IComment } from "../models/comment";
import { BaseController } from "./base.controller";

export class CommentController extends BaseController<IComment> {
  constructor(model: Model<IComment>) {
    super(model);
  }

  getCommentById = async (req: Request, res: Response) => {
    if (req.params.id) {
      return commentController.getById(req, res, [
        "_id",
        "text",
        "likes",
        "date"
      ]);
    }
    return commentController.getAll(req, res, ["_id", "text", "likes", "date"]);
  };

  getCommentsByPostId = async (req: Request, res: Response) => {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).send({ message: "Invalid post ID" });
    }

    try {
      const comments = await this.model
        .find({ postId })
        .select("_id text likes date");
      if (!comments.length) {
        return res
          .status(404)
          .send({ message: "No comments found for this post" });
      }
      return res.status(200).send(comments);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error retrieving comments", error });
    }
  };
}

const commentController = new CommentController(CommentModel);

export default commentController;
