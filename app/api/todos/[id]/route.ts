import { NextApiRequest } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// READ todos/{id}
export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  const { isAuthenticated } = await auth(req);
  if (isAuthenticated) {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(params.id, 10),
      },
    });

    if (todo) {
      return Response.json(todo);
    } else {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}

// UPDATE
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { isAuthenticated } = await auth(req as unknown as NextApiRequest);
  if (isAuthenticated) {
    const { title, completed } = await req.json();

    if (
      !title ||
      typeof title !== "string" ||
      completed === undefined ||
      typeof completed !== "boolean"
    ) {
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(params.id, 10),
      },
      data: {
        title,
        completed,
      },
    });

    return new Response(JSON.stringify(updatedTodo), {
      status: 200,
    });
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}

// DELETE
export async function DELETE(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  const { isAuthenticated } = await auth(req);
  if (isAuthenticated) {
    await prisma.todo.delete({
      where: { id: parseInt(params.id, 10) },
    });

    return new Response(null, { status: 204 });
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}