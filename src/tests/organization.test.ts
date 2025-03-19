import request from "supertest";
import mongoose, { Types } from "mongoose";
import initApp from "../app";
import { Express } from "express";
import User from "../models/user";
import Organization from "../models/organization";
import { userTest, organizationTestData } from "./mockData";

let app: Express;
let accessToken: string;
let userId: Types.ObjectId;

beforeAll(async () => {
  app = await initApp();

  // Drop all users and organizations collections
  await User.deleteMany({});
  await Organization.deleteMany({});

  // Register a user and get the access token
  const signupResponse = await request(app)
    .post("/api/auth/signup")
    .send(userTest);

  userId = signupResponse.body._id;

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
  await Organization.deleteMany({});
});

describe("Organization Endpoints", () => {
  it("should create a new organization", async () => {
    const response = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ ...organizationTestData.organization1, userId });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(organizationTestData.organization1.name);
    expect(response.body.city).toBe(organizationTestData.organization1.city);
  });

  it("should get all organizations", async () => {
    await Organization.create({
      ...organizationTestData.organization1,
      userId,
    });
    await Organization.create({
      ...organizationTestData.organization2,
      userId,
    });

    const response = await request(app)
      .get("/api/organizations")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.organizations.length).toBe(2);
    expect(response.body.organizations[0].name).toBe(organizationTestData.organization1.name);
    expect(response.body.organizations[1].name).toBe(organizationTestData.organization2.name);
  });

  it("should get an organization by ID", async () => {
    const organization = await Organization.create({
      ...organizationTestData.organization1,
      userId,
    });

    const response = await request(app)
      .get(`/api/organizations/${organization._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(organizationTestData.organization1.name);
  });

  it("should update an organization by ID", async () => {
    const organization = await Organization.create({
      ...organizationTestData.organization1,
      userId,
    });

    const updatedOrganizationData = {
      city: "Los Angeles",
      name: "Updated Organization",
      userId: userId,
      focusAreas: [],
      description: "This is an updated organization",
      imageUrl: "http://example.com/updated_image.jpg",
      websiteLink: "http://example.com/updated",
    };

    const response = await request(app)
      .put(`/api/organizations/${organization._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedOrganizationData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedOrganizationData.name);
    expect(response.body.city).toBe(updatedOrganizationData.city);
  });

  it("should delete an organization by ID", async () => {
    const organization = await Organization.create({
      ...organizationTestData.organization1,
      userId,
    });

    const response = await request(app)
      .delete(`/api/organizations/${organization._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const deletedOrganization = await Organization.findById(organization._id);
    expect(deletedOrganization).toBeNull();
  });

  it("should return 404 if organization not found", async () => {
    const response = await request(app)
      .get(`/api/organizations/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it("should get organizations by user ID", async () => {
    await Organization.create({
      ...organizationTestData.organization1,
      userId,
    });
    await Organization.create({
      ...organizationTestData.organization2,
      userId,
    });

    const response = await request(app)
      .get(`/api/organizations/user/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe(organizationTestData.organization1.name);
    expect(response.body[1].name).toBe(organizationTestData.organization2.name);
  });
});
