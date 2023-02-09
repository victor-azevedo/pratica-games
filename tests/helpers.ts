import { faker } from "@faker-js/faker";
import prisma from "../src/config/database";

export async function cleanDb() {
  await prisma.game.deleteMany();
  await prisma.console.deleteMany();
}

export function createDifferentId(id: number) {
  let differentId = faker.datatype.number({ min: 0 });
  while (differentId === id) {
    differentId = faker.datatype.number({ min: 0 });
  }
  return differentId;
}
