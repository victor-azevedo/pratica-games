import { faker } from "@faker-js/faker";
import prisma from "../../src/config/database";
import { GameInput } from "../../src/services/games-service";
import { createConsole } from "./console-factor";

export async function createGame(params: Partial<GameInput> = {}) {
  if (params.consoleId) {
    const data = createGameBody({ consoleId: params.consoleId });
    return prisma.game.create({
      data,
    });
  }
  const consoleCreated = await createConsole();
  const data = createGameBody({ consoleId: consoleCreated.id });
  return prisma.game.create({
    data,
  });
}

export function createGameBody(params: Partial<GameInput> = {}) {
  return {
    title: params.title || faker.lorem.word(),
    consoleId: params.consoleId || faker.datatype.number(),
  };
}

export function createGameFalseBody(params: Partial<GameInput> = {}) {
  return {
    title: params.title || faker.lorem.word(),
    consoleId: params.consoleId || faker.datatype.number(),
    wrongField: faker.lorem.word(),
  };
}

export async function findGameById(id: number) {
  return prisma.game.findFirst({ where: { id }, include: { Console: true } });
}
