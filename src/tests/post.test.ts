import request from "supertest";
import mongoose, { Types } from "mongoose";
import initApp from "../app"; // Assuming you have an initApp function to initialize the app
import { Express } from "express";
import User from "../models/user";
import Post from "../models/post";
import { userTest, postTestData } from "./mockData";

let app: Express;
let accessToken: string;
let userId: Types.ObjectId;

beforeAll(async () => {
  app = await initApp();

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
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Post.deleteMany({});
});

describe("Post Endpoints", () => {
  it("should create a new post", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(postTestData.post1);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(postTestData.post1.title);
    expect(response.body.content).toBe(postTestData.post1.content);
  });

  it("should get all posts", async () => {
    await Post.create(postTestData.post1);
    await Post.create(postTestData.post2);

    const response = await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe(postTestData.post1.title);
    expect(response.body[1].title).toBe(postTestData.post2.title);
  });

  it("should get a post by ID", async () => {
    const post = await Post.create(postTestData.post1);

    const response = await request(app)
      .get(`/api/posts/${post._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(postTestData.post1.title);
  });

  it("should update a post by ID", async () => {
    const post = await Post.create(postTestData.post1);

    const updatedPostData = {
      title: "Updated Post",
      content: "Updated content",
    };

    const response = await request(app)
      .put(`/api/posts/${post._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedPostData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedPostData.title);
    expect(response.body.content).toBe(updatedPostData.content);
  });

  it("should delete a post by ID", async () => {
    const post = await Post.create(postTestData.post1);

    const response = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const deletedPost = await Post.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it("should return 404 if post not found", async () => {
    const response = await request(app)
      .get(`/api/posts/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it("should like a post", async () => {
    const post = await Post.create(postTestData.post1, User: userId);

    const response = await request(app)
      .put(`/api/posts/${post._id}/like`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ userId: userTest._id });

    expect(response.status).toBe(200);
    expect(response.body.likes).toContain(userTest._id);
  });

  it("should get likes by post ID", async () => {
    const post = await Post.create(postTestData.post1);
    post.likes.push(userTest._id);
    await post.save();

    const response = await request(app)
      .get(`/api/posts/likes/${post._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toContain(userTest._id);
  });

  it("should get post with comments", async () => {
    const post = await Post.create(postTestData.post1);

    const response = await request(app)
      .get(`/api/posts/comments/${post._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(postTestData.post1.title);
  });
});
