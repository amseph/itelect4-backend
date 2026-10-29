import "dotenv/config";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/config/db", () => ({
  connectDatabase: vi.fn().mockResolvedValue(undefined),
}));

import { app } from "../src/app";

function tokenFor(userId: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET must be set in the local environment");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "5m" });
}

describe("POST /api/ai authentication", () => {
  beforeAll(() => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be set in the local environment");
    }
  });

  it("rejects a request without a token", async () => {
    const response = await request(app).post("/api/ai").send({ prompt: "A sufficiently long study session description." });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token. Send Authorization: Bearer <token>");
  });

  it("rejects a forged token", async () => {
    const forgedToken = jwt.sign({ userId: "forged-user" }, "a-different-secret", { expiresIn: "5m" });
    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${forgedToken}`)
      .send({ prompt: "A sufficiently long study session description." });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is invalid or has expired");
  });

  it("allows a valid token through requireAuth and reaches prompt validation", async () => {
    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${tokenFor("session-12-test-user")}`)
      .send({ prompt: "Too short" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain("Describe your study session in at least 20 characters.");
  });
});
