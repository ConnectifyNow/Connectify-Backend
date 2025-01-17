import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import OpenAI from "openai";

let app: Express;
jest.mock("openai");

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("AI Description API", () => {
  //   it("responds with 200", async () => {
  //     const response = await request(app).get(`/api/ai/${"hila organization"}`);
  //     console.log({ response: response.error });
  //     expect(response.status).toBe(200);
  //   });

  it("should return 500 if there is an error creating the OpenAI object", async () => {
    (OpenAI as unknown as jest.Mock).mockImplementation(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app).get("/api/ai/testOrg");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error processing AI request");
  });
});
