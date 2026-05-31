const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test-db";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const { createApp } = require("../app");

test("GET /api/health returns status ok", async () => {
  const app = createApp();
  const response = await request(app).get("/api/health");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
});
