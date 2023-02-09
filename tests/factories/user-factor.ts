import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../src/database";

function userBody(params: Partial<User> = {}) {
  const newUserBody = {
    name: params.name || faker.name.firstName(),
    email: params.email || faker.internet.email(),
    password: params.password || faker.internet.password(8),
  };
  return newUserBody;
}

export function signUpBody(params: Partial<User> = {}) {
  const user = userBody({ ...params });
  return { ...user, confirmPassword: user.password };
}

export function signUpBodyFalse() {
  return {
    name: faker.datatype.string(2),
    email: faker.name.firstName(),
    password: faker.internet.password(5),
    confirmPassword: faker.internet.password(6),
  };
}

export async function createUser(params: Partial<User> = {}) {
  const user = userBody({ ...params });
  user.password = bcrypt.hashSync(user.password, 10);

  return await prisma.user.create({
    data: user,
  });
}
