import { NextApiRequest } from "next";
import { authenticateAndFindUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/errorHandling";

// CREATE one
export async function POST(req: Request) {
  try {
    const user = await authenticateAndFindUser(
      req as unknown as NextApiRequest
    );

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
  } catch (error) {
    return handleApiError(error);
  }
}

// READ all
export async function GET(req: NextApiRequest) {
  try {
    const user = await authenticateAndFindUser(req);

    const allTodos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
    });

    return new Response(JSON.stringify(allTodos), { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
