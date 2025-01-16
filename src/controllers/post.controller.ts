import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import PostModel, { IPost } from "../models/post";
import CommentModel, { IComment } from "../models/comment";
import UserModel, { IUser } from "../models/user";
import VolunteerModel from "../models/volunteer";
import OrganizationModel from "../models/organization";
import { BaseController } from "./base.controller";
import { Role } from "../types";

export class PostController extends BaseController<IPost> {
  constructor(model: Model<IPost>) {
    super(model);
  }

  getPostsOverview = async (req: Request, res: Response) => {
    try {
      const query = req.params.id ? { user: req.params.id } : {};
      const posts = await this.model.find(query).populate("user").exec();

      const postsWithUserInfo = await Promise.all(
        posts.map(async (post) => {
          const user = post.user as unknown as IUser;
          let userAdditionalDetails = null;
          let userKey = "";

          if (user.role === Role.Volunteer) {
            userAdditionalDetails = await VolunteerModel.findOne({
              userId: user._id,
            });
            userKey = "volunteer";
          } else if (user.role === Role.Organization) {
            userAdditionalDetails = await OrganizationModel.findOne({
              userId: user._id,
            });
            userKey = "organization";
          }

          const comments = await CommentModel.find({ post: post._id })
            .populate("user")
            .exec();

          const commentsWithUserInfo = await Promise.all(
            comments.map(async (comment) => {
              const commentUser = comment.user as unknown as IUser;
              let commentUserAdditionalDetails = null;
              let commentUserKey = "";

              if (commentUser.role === Role.Volunteer) {
                commentUserAdditionalDetails = await VolunteerModel.findOne({
                  userId: commentUser._id,
                });
                commentUserKey = "volunteer";
              } else if (commentUser.role === Role.Organization) {
                commentUserAdditionalDetails = await OrganizationModel.findOne({
                  userId: commentUser._id,
                });
                commentUserKey = "organization";
              }

              return {
                ...comment.toObject(),
                user: {
                  ...commentUser.toObject(),
                  [commentUserKey]: commentUserAdditionalDetails,
                },
              };
            })
          );

          return {
            ...post.toObject(),
            user: {
              ...user.toObject(),
              [userKey]: userAdditionalDetails,
            },
            comments: commentsWithUserInfo,
          };
        })
      );

      return res.status(200).json(postsWithUserInfo);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
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

      const userId = req.body.userId;
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
      const post = await PostModel.findById(postId)
        .populate("comments")
        .populate("user")
        .exec();
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
