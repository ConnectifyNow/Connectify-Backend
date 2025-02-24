import { Express } from "express";
import request from "supertest";
import mongoose from "mongoose";
import initApp from "../app";
import Skill from "../models/skill";
import { skillTestData, userTest } from "./mockData";

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
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Skill.deleteMany({});
});

describe("Skill Controller", () => {
  it("should create a new skill", async () => {
    const response = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(skillTestData.skill1);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(skillTestData.skill1.name);
  });

  it("should get all skills", async () => {
    await Skill.create(skillTestData.skill1);
    await Skill.create(skillTestData.skill2);

    const response = await request(app)
      .get("/api/skills")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe(skillTestData.skill1.name);
    expect(response.body[1].name).toBe(skillTestData.skill2.name);
  });

  it("should get a skill by ID", async () => {
    const skill = await Skill.create(skillTestData.skill1);

    const response = await request(app)
      .get(`/api/skills/${skill._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(skillTestData.skill1.name);
  });

  it("should update a skill by ID", async () => {
    const skill = await Skill.create(skillTestData.skill1);

    const updatedSkillData = { name: "TypeScript" };

    const response = await request(app)
      .put(`/api/skills/${skill._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedSkillData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedSkillData.name);
  });

  it("should delete a skill by ID", async () => {
    const skill = await Skill.create(skillTestData.skill1);

    const response = await request(app)
      .delete(`/api/skills/${skill._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const deletedSkill = await Skill.findById(skill._id);
    expect(deletedSkill).toBeNull();
  });

  it("should return 404 if skill not found", async () => {
    const response = await request(app)
      .get(`/api/skills/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
