import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import prisma from "../../src/config/database";

export async function createConsole(
  params: Partial<Prisma.ConsoleCreateInput> = {}
) {
  const body = createConsoleBody({ ...params });
  return prisma.console.create({
    data: body,
  });
}

export function createConsoleBody(
  params: Partial<Prisma.ConsoleCreateInput> = {}
) {
  return {
    name: params.name || faker.lorem.word(),
  };
}

export function createConsoleFalseBody(
  params: Partial<Prisma.ConsoleCreateInput> = {}
) {
  return {
    name: params.name || faker.lorem.word(),
    wrongField: faker.lorem.word(),
  };
}
