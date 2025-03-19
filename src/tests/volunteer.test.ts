import request from "supertest";
import mongoose, { Types } from "mongoose";
import initApp from "../app"; // Assuming you have an initApp function to initialize the app
import { Express } from "express";
import User from "../models/user";
import Volunteer from "../models/volunteer";
import City from "../models/city";
import { userTest, volunteerTestData, cityTest } from "./mockData";

let app: Express;
let accessToken: string;
let userId: Types.ObjectId;
let cityId: Types.ObjectId;

beforeAll(async () => {
  app = await initApp();

  // Drop all users, volunteers, and cities collections
  await User.deleteMany({});
  await Volunteer.deleteMany({});
  await City.deleteMany({});

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

  // Create a city and get its ID
  const cityResponse = await City.create(cityTest);
  cityId = cityResponse._id as Types.ObjectId;
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Volunteer.deleteMany({});
});

describe("Volunteer Endpoints", () => {
  it("should create a new volunteer", async () => {
    const response = await request(app)
      .post("/api/volunteers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ ...volunteerTestData.volunteer1, userId, city: cityId });

    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe(volunteerTestData.volunteer1.firstName);
    expect(response.body.lastName).toBe(volunteerTestData.volunteer1.lastName);
  });

  it("should get all volunteers", async () => {
    await Volunteer.create({ ...volunteerTestData.volunteer1, userId, city: cityId });
    await Volunteer.create({ ...volunteerTestData.volunteer2, userId, city: cityId });

    const response = await request(app)
      .get("/api/volunteers")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.volunteers.length).toBe(2);
    expect(response.body.volunteers[0].firstName).toBe(volunteerTestData.volunteer1.firstName);
    expect(response.body.volunteers[1].firstName).toBe(volunteerTestData.volunteer2.firstName);
  });

  it("should get a volunteer by ID", async () => {
    const volunteer = await Volunteer.create({ ...volunteerTestData.volunteer1, userId, city: cityId });

    const response = await request(app)
      .get(`/api/volunteers/${volunteer._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe(volunteerTestData.volunteer1.firstName);
  });

  it("should update a volunteer by ID", async () => {
    const volunteer = await Volunteer.create({ ...volunteerTestData.volunteer1, userId, city: cityId });

    const updatedVolunteerData = {
      phone: "1111111111",
      firstName: "Updated",
      lastName: "Volunteer",
      city: cityId,
      skills: [],
      about: "This is an updated volunteer",
      userId: userId,
    };

    const response = await request(app)
      .put(`/api/volunteers/${volunteer._id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedVolunteerData);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe(updatedVolunteerData.firstName);
    expect(response.body.city).toBe(updatedVolunteerData.city.toString());
  });

  it("should delete a volunteer by ID", async () => {
    const volunteer = await Volunteer.create({ ...volunteerTestData.volunteer1, userId, city: cityId });

    const response = await request(app)
      .delete(`/api/volunteers/${volunteer._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    const deletedVolunteer = await Volunteer.findById(volunteer._id);
    expect(deletedVolunteer).toBeNull();
  });

  it("should return 404 if volunteer not found", async () => {
    const response = await request(app)
      .get(`/api/volunteers/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it("should get volunteers by user ID", async () => {
    await Volunteer.create({ ...volunteerTestData.volunteer1, userId, city: cityId });
    await Volunteer.create({ ...volunteerTestData.volunteer2, userId, city: cityId });

    const response = await request(app)
      .get(`/api/volunteers/user/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].firstName).toBe(volunteerTestData.volunteer1.firstName);
    expect(response.body[1].firstName).toBe(volunteerTestData.volunteer2.firstName);
  });
});