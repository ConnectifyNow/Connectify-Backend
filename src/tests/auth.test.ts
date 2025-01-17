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

  describe("Refresh Token API", () => {
    it("should handle expired refresh token after timeout", async () => {
      // Mocking expired refresh token
      const expiredRefreshToken = jwt.sign({ _id: "userId" }, "expiredSecret", {
        expiresIn: "-1s",
      });

      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Authorization", `Bearer ${expiredRefreshToken}`)
        .expect(401);

      expect(response.text).toContain("Unauthorized");
    });

    it("should handle missing authorization token during token refresh", async () => {
      const response = await request(app).post("/api/auth/refresh").expect(401);

      expect(response.text).toContain("Unauthorized");
    });

    it("should handle invalid authorization token during token refresh", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Authorization", "Bearer InvalidToken")
        .expect(401);

      expect(response.text).toContain("Unauthorized");
    });

    it("should return 401 if user not found in the database", async () => {
      // Mocking the User.findOne method to return null
      jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Authorization", `Bearer ${refreshToken}`)
        .expect(401);

      expect(response.text).toContain("User not found");
    });

    it("should return 500 if any error occurs during the process", async () => {
      // Mocking the User.findOne method to throw an error
      jest
        .spyOn(User, "findOne")
        .mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Authorization", `Bearer ${refreshToken}`)
        .expect(500);

      expect(response.text).toContain("Database error");
    });

    it("should refresh access token with valid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Authorization", `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      const newAccessToken = response.body.accessToken;
      newRefreshToken = response.body.refreshToken;

      const response2 = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${newAccessToken}`);
      expect(response2.statusCode).toBe(200);
    });
  });

  describe("Logout API", () => {
    it("should handle missing authorization token during logout", async () => {
      const response = await request(app).post("/api/auth/logout").expect(401);

      expect(response.text).toContain("Unauthorized");
    });

    it("should handle invalid authorization token during logout", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer InvalidToken")
        .expect(401);

      expect(response.text).toContain("Unauthorized");
    });

    it("should handle successful logout", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${newRefreshToken}`)
        .expect(200);

      expect(response.text).toContain("Logout successful");
    });
  });
});
