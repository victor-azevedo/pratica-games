import { faker } from "@faker-js/faker";

export function signInBodyFalse() {
  return {
    email: faker.name.firstName(),
    password: faker.internet.password(5),
  };
}
