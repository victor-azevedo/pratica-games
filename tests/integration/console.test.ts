import supertest from "supertest";
import app from "../../src/app";
import {
  createConsole,
  createConsoleBody,
  createConsoleFalseBody,
} from "../factories/console-factor";
import { cleanDb, createDifferentId } from "../helpers";

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /consoles", () => {
  it("should respond with status 201 when insert console in database", async () => {
    const consoleBody = createConsoleBody();

    const response = await server.post("/consoles").send(consoleBody);

    expect(response.status).toBe(201);
  });

  it("should respond with status 422 when don't send request body", async () => {
    const response = await server.post("/consoles");

    expect(response.status).toBe(422);
  });

  it("should respond with status 422 when request body is invalid", async () => {
    const consoleFalseBody = createConsoleFalseBody();

    const response = await server.post("/consoles").send(consoleFalseBody);

    expect(response.status).toBe(422);
  });

  it("should respond with status 409 when console already exist in database", async () => {
    const consoleAlreadyExist = await createConsole();
    const consoleRepeatBody = createConsoleBody({
      name: consoleAlreadyExist.name,
    });

    const response = await server.post("/consoles").send(consoleRepeatBody);

    expect(response.status).toBe(409);
  });
});

describe("GET /consoles", () => {
  it("should receive a empty array when there isn't console registered in database", async () => {
    const response = await server.get("/consoles");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("should respond with status 200, array contain one object when there is one console in database", async () => {
    const consoleCreated = await createConsole();

    const response = await server.get("/consoles");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        id: consoleCreated.id,
        name: consoleCreated.name,
      },
    ]);
  });

  it("should respond with status 200, array contain four object when there is four console in database", async () => {
    await createConsole();
    await createConsole();
    const consoleCreated = await createConsole();
    await createConsole();

    const response = await server.get("/consoles");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: consoleCreated.id,
          name: consoleCreated.name,
        },
      ])
    );
  });
});

describe("GET /consoles/:id", () => {
  it("should respond with status 200 and correct object that matches id", async () => {
    const { id, name } = await createConsole();

    const response = await server.get(`/consoles/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id,
      name,
    });
  });

  it("should respond with status 404 when id don't match any console in database", async () => {
    const { id } = await createConsole();
    let differentId = createDifferentId(id);

    const response = await server.get(`/consoles/${differentId}`);

    expect(response.status).toBe(404);
  });
});
