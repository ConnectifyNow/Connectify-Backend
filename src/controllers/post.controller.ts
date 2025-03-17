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
      let query: {
        _id?: string;
        postType?: string;
        skills?: { $in: string[] };
      } = {};
      if (req.params.postId) {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
          return res.status(400).send({ error: "Invalid user id format" });
        }
        query._id = req.params.postId;
      }

      if (req.query.skills) {
        const skills = Array.isArray(req.query.skills)
          ? req.query.skills.join(",")
          : req.query.skills;

        if (typeof skills === "string") {
          const skillsArray = skills.split(",");
          query.skills = { $in: skillsArray };
        }
      }

      //TODO: implement postType filter
      // if (req.query.postType) {
      //   query.postType = req.query.postType as string;
      // }

      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0; // Default to 0 if not provided
      const top = req.query.top ? parseInt(req.query.top as string, 10) : 5; // Default to 5 if not provided
      const totalPosts = await this.model.countDocuments(query);
      console.log("totalPosts", totalPosts);
      console.log("skip", skip);
      if (skip >= totalPosts) {
        return res.json([]); // Return an empty array if skip exceeds the total number of posts
      }

      //TODO: add type filter like skills

      const posts = await this.model
        .find(query)
        .skip(skip)
        .limit(top)
        .sort({ createdAt: -1 })
        .populate("user")
        .exec();
      if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
      }

      let postsWithUserInfo = await Promise.all(
        posts.map(async (post) => {
          // const user = post.user as unknown as IUser;
          let userAdditionalDetails = null;
          let userKey = "";
          //@ts-ignore
          if (post.user.role === Role.Volunteer) {
            userAdditionalDetails = await VolunteerModel.findOne({
              //@ts-ignore
              userId: post.user._id,
            });
            userKey = "volunteer";
            //@ts-ignore
          } else if (post.user.role === Role.Organization) {
            userAdditionalDetails = await OrganizationModel.findOne({
              //@ts-ignore
              userId: post.user._id,
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
              //@ts-ignore
              ...post.user.toObject(),
              [userKey]: userAdditionalDetails,
            },
            comments: commentsWithUserInfo,
          };
        })
      );

      return res.status(200).json(postsWithUserInfo);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  };

  getPostsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
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

      const userId = req.body.userId;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: "Invalid user id format" });
      }
      if (!userId) {
        return res.status(400).send({ error: "User id is required" });
      }

      if (post.likes.includes(userId)) {
        return res
          .status(400)
          .json({ message: "User has already liked this post" });
      } else {
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

      return res.status(200).json(post.likes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const postController = new PostController(PostModel);

export default postController;
