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
  console.log({ todo1, todo2 });
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
