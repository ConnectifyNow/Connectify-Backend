import request from "supertest";
import mongoose, { Types } from "mongoose";
import initApp from "../app"; // Assuming you have an initApp function to initialize the app
import { Express } from "express";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { userTest, postTestData } from "./mockData";

let app: Express;
let accessToken: string;
let userId: Types.ObjectId;
let postId: Types.ObjectId;

beforeAll(async () => {
  app = await initApp();

  // Drop all posts, users, and comments collections
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  // Register a user and get the access token
  const signupResponse = await request(app)
    .post("/api/auth/signup")
    .send(userTest);

  userId = signupResponse.body._id;

  const loginResponse = await request(app).post("/api/auth/signin").send({
    username: userTest.username,
    password: userTest.password,
  });

  accessToken = loginResponse.body.accessToken;

  // Create a post and get its ID
  const postResponse = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ ...postTestData.post1, user: userId });

  postId = postResponse.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Comment.deleteMany({});
});

describe("Comment Endpoints", () => {
  it("should create a new comment", async () => {
    const response = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ post: postId, user: userId, text: "This is a comment" });

    expect(response.status).toBe(201);
    expect(response.body.text).toBe("This is a comment");
  });

  it("should get all comments for a post", async () => {
    await Comment.create({ post: postId, user: userId, text: "Comment 1" });
    await Comment.create({ post: postId, user: userId, text: "Comment 2" });

    const response = await request(app)
      .get(`/api/comments/post/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].text).toBe("Comment 1");
    expect(response.body[1].text).toBe("Comment 2");
  });

  it("should get a comment by ID", async () => {
    const comment = await Comment.create({ post: postId, user: userId, text: "This is a comment" });

    const response = await request(app)
      .get(`/api/comments/${comment._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.text).toBe("This is a comment");
  });

  it("should update a comment by ID", async () => {
    const comment = await Comment.create({ post: postId, user: userId, text: "This is a comment" });

    const updatedCommentData = { text: "Updated comment", user: userId, post: postId };

    const response = await request(app)
      .put(`/api/comments/${comment._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedCommentData);

    expect(response.status).toBe(200);
    expect(response.body.text).toBe(updatedCommentData.text);
  });

  it("should delete a comment by ID", async () => {
    const comment = await Comment.create({ post: postId, user: userId, text: "This is a comment" });

    const response = await request(app)
      .delete(`/api/comments/${comment._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const deletedComment = await Comment.findById(comment._id);
    expect(deletedComment).toBeNull();
  });

  it("should return 404 if comment not found", async () => {
    const response = await request(app)
      .get(`/api/comments/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it("should like a comment", async () => {
    const comment = await Comment.create({ post: postId, user: userId, text: "This is a comment" });

    const response = await request(app)
      .put(`/api/comments/${comment._id}/like`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ userId });

    expect(response.status).toBe(200);
    expect(response.body.likes).toContain(userId.toString());
  });
});