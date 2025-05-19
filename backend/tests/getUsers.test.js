const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("GET /api/users - Fetch All Users", () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany({});
    await User.create([
      { name: "User One", email: "userone@example.com", password_hash: "hashedpassword1", role: "student", extra_info:{department: "CNTT", year: "3" }},
      { name: "User Two", email: "usertwo@example.com", password_hash: "hashedpassword2", role: "teacher", extra_info:{depatment: "CNTT", position: "GiangVien" }},
      { name: "User Three", email: "userthree@example.com", password_hash: "hashedpassword3", role: "library_staff", extra_info:{position: "NV", work_shift: "sang" }},
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should fetch all users successfully", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("email");
    expect(res.body[0]).toHaveProperty("role");
  });

  it("should handle server errors gracefully", async () => {
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error");
  });
});