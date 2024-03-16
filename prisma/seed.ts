import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "jared.c.gentry@gmail.com" },
    update: {},
    create: {
      name: "Jared Gentry",
      email: "jared.c.gentry@gmail.com",
      image: "https://avatars.githubusercontent.com/u/20710009?v=4",
    },
  });

  const todos = [
    { title: "walk the dog" },
    { title: "buy some milk" },
    { title: "read a book" },
    { title: "practice coding" },
    { title: "meditate for 20 minutes" },
  ];

  for (let i = 0; i < todos.length; i++) {
    await prisma.todo.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        title: todos[i].title,
        user: { connect: { id: user.id } },
      },
    });
  }
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
