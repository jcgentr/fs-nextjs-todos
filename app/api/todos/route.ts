import { NextApiRequest } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// CREATE one
export async function POST(req: Request) {
  const { isAuthenticated, token } = await auth(
    req as unknown as NextApiRequest
  );

  if (isAuthenticated && token?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
      });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        userId: user.id,
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
  const { isAuthenticated, token } = await auth(req);

  if (isAuthenticated && token?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const allTodos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
    });

    return Response.json(allTodos);
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
