# Pratica Games - TESTS

## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example`. For more info: [Connectoions URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)
5. Run all migrations

```bash
npm run dev:prisma:migrate
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

## How to run tests

1. Follow the steps in the last section

2. Configure the `.env.test` file using the `.env.example`. For more info: [Connectoions URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)

3. Run all migrations

```bash
npm run test:prisma:migrate
```

4. Run test: (locally)

```bash
npm run test
```
