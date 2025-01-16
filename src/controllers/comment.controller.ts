import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import CommentModel, { IComment } from "../models/comment";
import { BaseController } from "./base.controller";
import PostModel from "../models/post";

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
        "date",
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

  addComment = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { userId, text } = req.body;
    if (
      !mongoose.isValidObjectId(postId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).send({ message: "Invalid post ID or user ID" });
    }

    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      const newComment = new CommentModel({
        user: userId,
        post: postId,
        text,
        date: new Date(),
      });

      const savedComment = await newComment.save();

      return res.status(201).json(savedComment);
    } catch (error) {
      return res.status(500).send({ message: "Error adding comment", error });
    }
  };

  likeComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (
      !mongoose.isValidObjectId(commentId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).send({ message: "Invalid comment ID or user ID" });
    }

    try {
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.likes.includes(userId)) {
        return res
          .status(400)
          .send({ message: "User has already liked this comment" });
      }

      comment.likes.push(userId);
      await comment.save();

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).send({ message: "Error liking comment", error });
    }
  };
}
const commentController = new CommentController(CommentModel);

export default commentController;
