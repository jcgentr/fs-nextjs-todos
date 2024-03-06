import prisma from "@/lib/prisma";

export async function GET() {
  const allTodos = await prisma.todo.findMany();
  console.log(allTodos);

  return Response.json({ allTodos });
}
