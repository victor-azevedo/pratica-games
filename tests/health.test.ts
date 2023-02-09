import supertest from "supertest";
import app from "../src/app";
import httpStatus from "http-status";

const api = supertest(app);

describe("Connection test:", () => {
  it("Test GET /health", async () => {
    const res = await api.get("/health");

    expect(res.status).toBe(httpStatus.OK);
  });
}); 
