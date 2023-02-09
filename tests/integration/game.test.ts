import supertest from "supertest";
import app from "../../src/app";
import { createConsole } from "../factories/console-factor";
import {
  createGame,
  createGameBody,
  createGameFalseBody,
  findGameById,
} from "../factories/game-factor";
import { cleanDb, createDifferentId } from "../helpers";

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /games", () => {
  it("should respond with status 201 when insert game in database", async () => {
    const consoleTest = await createConsole();
    const gameBody = createGameBody({ consoleId: consoleTest.id });

    const response = await server.post("/games").send(gameBody);

    expect(response.status).toBe(201);
  });

  it("should respond with status 422 when don't send request body", async () => {
    const response = await server.post("/games");

    expect(response.status).toBe(422);
  });

  it("should respond with status 422 when request body is invalid", async () => {
    const gameFalseBody = createGameFalseBody();

    const response = await server.post("/games").send(gameFalseBody);

    expect(response.status).toBe(422);
  });

  it("should respond with status 409 when game already exist in database", async () => {
    const gameAlreadyExist = await createGame();
    const gameRepeatBody = createGameBody({
      title: gameAlreadyExist.title,
      consoleId: gameAlreadyExist.consoleId,
    });

    const response = await server.post("/games").send(gameRepeatBody);

    expect(response.status).toBe(409);
  });

  it("should respond with status 409 when console don't exist in database", async () => {
    const { consoleId } = await createGame();
    const differentConsoleId = createDifferentId(consoleId);
    const body = createGameBody({ consoleId: differentConsoleId });

    const response = await server.post("/games").send(body);

    expect(response.status).toBe(409);
  });
});

describe("GET /games", () => {
  it("should receive a empty array when there isn't game registered in database", async () => {
    const response = await server.get("/games");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("should respond with status 200, array contain one object when there is one game in database", async () => {
    const gameCreated = await createGame();
    const gameResponse = await findGameById(gameCreated.id);

    const response = await server.get("/games");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        id: gameResponse?.id,
        title: gameResponse?.title,
        consoleId: gameResponse?.consoleId,
        Console: gameResponse?.Console,
      },
    ]);
  });

  it("should respond with status 200, array contain four object when there is four game in database", async () => {
    await createGame();
    await createGame();
    const gameCreated = await createGame();
    await createGame();
    const gameResponse = await findGameById(gameCreated.id);

    const response = await server.get("/games");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: gameResponse?.id,
          title: gameResponse?.title,
          consoleId: gameResponse?.consoleId,
          Console: gameResponse?.Console,
        },
      ])
    );
  });
});

describe("GET /games/:id", () => {
  it("should respond with status 200 and correct object that matches id", async () => {
    const { id, title, consoleId } = await createGame();

    const response = await server.get(`/games/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id,
      title,
      consoleId,
    });
  });

  it("should respond with status 404 when id don't match any game in database", async () => {
    const { id } = await createGame();
    const differentId = createDifferentId(id);

    const response = await server.get(`/games/${differentId}`);

    expect(response.status).toBe(404);
  });
});
