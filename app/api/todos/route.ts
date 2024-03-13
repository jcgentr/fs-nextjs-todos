import { NextApiRequest } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// CREATE one
export async function POST(req: Request) {
  const { isAuthenticated } = await auth(req as unknown as NextApiRequest);
  if (isAuthenticated) {
    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
      });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
      },
    });

    return new Response(JSON.stringify(newTodo), { status: 201 });
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}

// READ all
export async function GET(req: NextApiRequest) {
  const { isAuthenticated } = await auth(req);
  if (isAuthenticated) {
    const allTodos = await prisma.todo.findMany();

    return Response.json(allTodos);
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
