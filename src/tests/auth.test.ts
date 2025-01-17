import { Express } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "../app";
import User from "../models/user";

jest.mock("google-auth-library");
let app: Express;

const userData = {
  // name: "new Hila ohana",
  username: "new.hila.ohana",
  email: "new.hila.ohana@example.com",
  password: "password123",
  role: 0,
  withCreation: true,
};

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: userData.email });
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication tests", () => {
  describe("Signup API", () => {
    it("should return 500 given error during user Signup", async () => {
      // Mocking the User.create method to throw an error
      jest.spyOn(User, "create").mockImplementationOnce(() => {
        throw new Error("Mocked user creation error");
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(500);

      expect(response.text).toContain("Mocked user creation error");
    });

    it("should signup a new user", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData);
      expect(response.statusCode).toBe(201);
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.role).toBe(userData.role);
    });

    it("should handle missing information", async () => {
      const incompleteData = {
        username: "new.hila.ohana",
        email: "hila.ohana@example.com",
        // Missing password, role
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(incompleteData)
        .expect(400);

      expect(response.text).toBe("can't signup the user - missing info");
    });

    it("should handle duplicate email registration", async () => {
      const duplicateResponse = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(406);

      expect(duplicateResponse.text).toBe("User already exists");
    });
  });

  describe("Signin API", () => {
    it("should return 400 if username or password is missing", async () => {
      const response = await request(app).post("/api/auth/signin").send({});

      expect(response.status).toBe(400);
      expect(response.text).toContain("missing username or password");
    });

    it("should return 401 if username or password is incorrect", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        username: "nonexistent@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.text).toContain("username or password incorrect");
    });

    // Test for successful signin
    it("should return 200 with access and refresh tokens if credentials are correct", async () => {
      const response = await request(app)
        .post("/api/auth/signin")
        .send({ username: "new.hila.ohana", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;

      expect(response.body.user).toEqual({
        _id: expect.any(String),
        role: 0,
        username: "new.hila.ohana",
        email: "new.hila.ohana@example.com",
        volunteer: null,
        organization: null,
      });
    });
  });
});
