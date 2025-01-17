import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initApp from "../app";
import User from "../models/user";

let accessToken: string;
let userId: string;

let app: Express;

const userData = {
  username: "new.hila.ohana",
  email: "new.hila.ohana@example.com",
  password: "password123",
  role: 0,
  withCreation: true,
};

const userData2 = {
  username: "hillali6",
  email: "hila.mail",
  password: "1234",
  role: 0,
};

beforeAll(async () => {
  app = await initApp();

  await User.deleteMany({
    username: { $in: [userData.username, userData2.username] },
  });

  const response = await request(app).post("/api/auth/signup").send(userData);
  expect(response.statusCode).toBe(201);

  await request(app).post("/api/auth/signup").send(userData2);
  expect(response.statusCode).toBe(201);

  const authResponse = await request(app)
    .post("/api/auth/signin")
    .send({ username: userData.username, password: userData.password });

  await request(app)
    .post("/api/auth/signin")
    .send({ username: userData2.username, password: userData2.password });

  accessToken = authResponse.body.accessToken;
  userId = authResponse.body.user._id;
});

afterAll(async () => {
  await User.deleteMany({ username: userData.username });

  // Close the MongoDB connection
  await mongoose.connection.close();
});

describe("GET /api/users/:id", () => {
  it("should get user details by ID", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", userData.username);
    // expect(response.body).toHaveProperty("email", userData.email);
  });

  it("should handle internal server error (500)", async () => {
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });

    console.log({ userId });
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual("Internal Server Error");
  });

  it("should handle internal server error (500)", async () => {
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual("Internal Server Error");
  });
});

describe("GET /api/users", () => {
  it("should get all user details", async () => {
    const response = await request(app)
      .get(`/api/users`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((user) => {
      expect(user).toHaveProperty("username");
    });
  });

  it("should handle internal server error (500)", async () => {
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .get(`/api/users`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});
