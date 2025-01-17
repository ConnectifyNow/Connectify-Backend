import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initApp from "../app"; // Assuming you have an initApp function to initialize the app
import User from "../models/user";
import FocusArea from "../models/focusArea";
import { userTest, focusAreaTestData } from "./mockData";

let app: Express;
let accessToken: string;

beforeAll(async () => {
  app = await initApp();

  // Register a user and get the access token
  await request(app).post("/api/auth/signup").send(userTest);

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
  await FocusArea.deleteMany({});
});

describe("Focus Area Endpoints", () => {
  it("should create a new focus area", async () => {
    const response = await request(app)
      .post("/api/focusAreas")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(focusAreaTestData.focusArea1);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(focusAreaTestData.focusArea1.name);
  });

  it("should get all focus areas", async () => {
    await FocusArea.create(focusAreaTestData.focusArea1);
    await FocusArea.create(focusAreaTestData.focusArea2);

    const response = await request(app)
      .get("/api/focusAreas")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe(focusAreaTestData.focusArea1.name);
    expect(response.body[1].name).toBe(focusAreaTestData.focusArea2.name);
  });

  it("should get a focus area by ID", async () => {
    const focusArea = await FocusArea.create(focusAreaTestData.focusArea1);

    const response = await request(app)
      .get(`/api/focusAreas/${focusArea._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(focusAreaTestData.focusArea1.name);
  });

  it("should update a focus area by ID", async () => {
    const focusArea = await FocusArea.create(focusAreaTestData.focusArea1);

    const updatedFocusAreaData = { name: "Environment" };

    const response = await request(app)
      .put(`/api/focusAreas/${focusArea._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedFocusAreaData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedFocusAreaData.name);
  });

  it("should delete a focus area by ID", async () => {
    const focusArea = await FocusArea.create(focusAreaTestData.focusArea1);

    const response = await request(app)
      .delete(`/api/focusAreas/${focusArea._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const deletedFocusArea = await FocusArea.findById(focusArea._id);
    expect(deletedFocusArea).toBeNull();
  });

  it("should return 404 if focus area not found", async () => {
    const response = await request(app)
      .get(`/api/focusAreas/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
