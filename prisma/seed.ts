import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const todo1 = await prisma.todo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "walk the dog",
    },
  });

  const todo2 = await prisma.todo.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "buy some milk",
    },
  });

  const todo3 = await prisma.todo.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "read a book",
    },
  });

  const todo4 = await prisma.todo.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: "practice coding",
    },
  });

  const todo5 = await prisma.todo.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: "meditate for 20 minutes",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
