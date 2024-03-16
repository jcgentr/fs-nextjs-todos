import { NextApiRequest } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// READ todos/{id}
export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
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

    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(params.id, 10),
        userId: user.id,
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

    try {
      const updatedTodo = await prisma.todo.update({
        where: {
          id: parseInt(params.id, 10),
          userId: user.id,
        },
        data: {
          title,
          completed,
        },
      });

      return new Response(JSON.stringify(updatedTodo), {
        status: 200,
      });
    } catch (error) {
      // If the todo item is not found, Prisma will throw an error
      return new Response(JSON.stringify({ error: "Todo not found" }), {
        status: 404, // Not Found
      });
    }
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

    try {
      await prisma.todo.delete({
        where: { id: parseInt(params.id, 10), userId: user.id },
      });

      return new Response(null, { status: 204 }); // No Content
    } catch (error) {
      // If the todo item is not found, Prisma will throw an error
      return new Response(JSON.stringify({ error: "Todo not found" }), {
        status: 404, // Not Found
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
