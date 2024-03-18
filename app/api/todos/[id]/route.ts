import { NextApiRequest } from "next";
import { authenticateAndFindUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/errorHandling";

// READ todos/{id}
export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateAndFindUser(req);

    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(params.id, 10),
        userId: user.id,
      },
    });

    if (todo) {
      return new Response(JSON.stringify(todo), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}

// UPDATE
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateAndFindUser(
      req as unknown as NextApiRequest
    );
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
      throw { status: 404, message: "Todo not found" };
    }
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE
export async function DELETE(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateAndFindUser(req);

    try {
      await prisma.todo.delete({
        where: { id: parseInt(params.id, 10), userId: user.id },
      });

      return new Response(null, { status: 204 }); // No Content
    } catch (error) {
      // If the todo item is not found, Prisma will throw an error
      throw { status: 404, message: "Todo not found" };
    }
  } catch (error) {
    return handleApiError(error);
  }
}
