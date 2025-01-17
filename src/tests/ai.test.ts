import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import organization from "../models/organization";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("AI Description API", () => {
  it("responds with 200", async () => {
    const response = await request(app).get(`/api/ai/${"hila organization"}`);

    expect(response.status).toBe(200);
  });

  it("responds with 400 if AI request fails", async () => {
    const response = await request(app).get(`/api/ai/`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("org name is required");
  });

  it("responds with 500 if AI request fails", async () => {
    const response = await request(app).get(`/api/ai/${"hila organization"}`);
    // org name is required
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error processing AI request");
  });
});
