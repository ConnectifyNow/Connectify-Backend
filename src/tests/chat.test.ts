import request from "supertest";
import mongoose, { Types } from "mongoose";
import { Express } from "express";
import initApp from "../app"; // Assuming you have an initApp function to initialize the app
import User from "../models/user";
import Chat from "../models/chat";
import Message from "../models/message";
import { userTest, userTest2 } from "./mockData";

let app: Express;
let accessToken: string;
let userId: Types.ObjectId;
let userId2: Types.ObjectId;

beforeAll(async () => {
  app = await initApp();

  // Drop all users, chats, and messages collections
  await User.deleteMany({});
  await Chat.deleteMany({});
  await Message.deleteMany({});

  // Register users and get the access token
  const signupResponse1 = await request(app)
    .post("/api/auth/signup")
    .send(userTest);

  userId = signupResponse1.body._id;

  const signupResponse2 = await request(app)
    .post("/api/auth/signup")
    .send(userTest2);

  userId2 = signupResponse2.body._id;

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
  await Chat.deleteMany({});
  await Message.deleteMany({});
});

describe("Chat Endpoints", () => {
  it("should start a conversation with a specific user", async () => {
    const response = await request(app)
      .post(`/api/chats/conversation/with/${userId2}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(2);
    expect(response.body.users[0]._id).toBe(userId.toString());
    expect(response.body.users[1]._id).toBe(userId2.toString());
  });

  it("should get all conversations for the authenticated user", async () => {
    await Chat.create({ users: [userId, userId2], messages: [] });

    const response = await request(app)
      .get("/api/chats/conversation")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].users.length).toBe(2);
  });

  it("should get conversation with a specific user", async () => {
    await Chat.create({ users: [userId, userId2], messages: [] });

    const response = await request(app)
      .get(`/api/chats/conversation/with/${userId2}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(2);
    expect(response.body.users[0]).toBe(userId.toString());
    expect(response.body.users[1]).toBe(userId2.toString());
  });

  it("should get messages in a conversation", async () => {
    const chat = await Chat.create({ users: [userId, userId2], messages: [] });
    const message = await Message.create({ content: "Hello", sender: userId });
    chat.messages.push(message._id);
    await chat.save();

    const response = await request(app)
      .get(`/api/chats/conversation/${chat._id}/messages`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe("Hello");
  });
});
