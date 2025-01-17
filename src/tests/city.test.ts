import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import User from "../models/user";
import City from "../models/city";
import city from "../models/city";

let app: Express;
let accessToken: string;

const userTest = {
  username: "testuser",
  email: "testuser@example.com",
  password: "password",
  role: 0,
  withCreation: true,
};

const cityTest = {
  name: "New York",
};

const cityTest2 = {
  name: "Los Angeles",
};

beforeAll(async () => {
  app = await initApp();

  // Register a user and get the access token
  await request(app).post("/auth/signup").send(userTest);

  const loginResponse = await request(app).post("/auth/signin").send({
    username: userTest.username,
    password: userTest.password,
  });

  accessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await City.deleteMany({});
});

describe("CityController", () => {
  it("should create a new city", async () => {
    const response = await request(app)
      .post("/api/cities")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(cityTest);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(cityTest.name);
  });

  it("should get all cities", async () => {
    await City.create(cityTest);
    await City.create(cityTest2);

    const response = await request(app)
      .get("/api/cities")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe(cityTest.name);
    expect(response.body[1].name).toBe(cityTest2.name);
  });
});
