import request from "supertest";
import { Express } from "express";
import initApp from "../app";
import fs from "fs/promises";
import mongoose from "mongoose";

let app: Express;

beforeAll(async () => {
  app = await initApp();

  const fileExists = await fs
    .access("public/test-image.png")
    .then(() => true)
    .catch(() => false);

  if (!fileExists) {
    await request(app)
      .post("/api/file/image")
      .attach("file", "public/test-image.png");
  }
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("Image Upload API", () => {
  it("responds with 200 and image URL if image is provided", async () => {
    const response = await request(app)
      .post("/api/file/image")
      .attach("file", "public/test-image.png");

    expect(response.status).toBe(200);
  });
});
