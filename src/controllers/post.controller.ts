import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import PostModel, { IPost } from "../models/post";
import CommentModel, { IComment } from "../models/comment";
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

  addComment = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send({ error: "Invalid post id format" });
      }
      if (!postId) {
        return res.status(400).send({ error: "Post id is required" });
      }
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = await CommentModel.create({
        ...req.body,
        postId: postId,
        likes: [],
      });
      post.comments.push(comment._id.toString());
      await post.save();

      return res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  likePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      if (!mongoose.Types.UUID.isValid(postId)) {
        return res.status(400).send({ error: "Invalid post id format" });
      }
      if (!postId) {
        return res.status(400).send({ error: "Post id is required" });
      }
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const userId = req.params.userId;
      if (!mongoose.Types.UUID.isValid(userId)) {
        return res.status(400).send({ error: "Invalid user id format" });
      }
      if (!userId) {
        return res.status(400).send({ error: "User id is required" });
      }

      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
      }

      await post.save();

      return res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getLikesByPostId = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      if (!mongoose.Types.UUID.isValid(postId)) {
        return res.status(400).send({ error: "Invalid post id format" });
      }
      if (!postId) {
        return res.status(400).send({ error: "Post id is required" });
      }
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post.likes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getPostWithComments = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;

      const post = await PostModel.findById(postId).populate("comments").exec();
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
}

const postController = new PostController(PostModel);

export default postController;
