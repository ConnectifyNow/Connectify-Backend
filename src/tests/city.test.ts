import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import User from "../models/user";
import City from "../models/city";

let app: Express;
let accessToken: string;

const userTest = {
  username: "testuser",
  email: "testuser@example.com",
  password: "password",
  role: 0,
  withCreation: true,
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
      .post("/cities")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "New York",
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New York");
  });

  it("should get all cities", async () => {
    await City.create({ name: "New York" });
    await City.create({ name: "Los Angeles" });

    const response = await request(app)
      .get("/cities")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe("New York");
    expect(response.body[1].name).toBe("Los Angeles");
  });

  it("should get a city by ID", async () => {
    const city = await City.create({ name: "New York" });

    const response = await request(app)
      .get(`/cities/${city._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("New York");
  });

  it("should return 404 if city not found", async () => {
    const response = await request(app)
      .get(`/cities/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
