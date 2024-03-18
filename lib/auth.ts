import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function auth(req: NextApiRequest) {
  const token = await getToken({ req });
  return { isAuthenticated: token !== null, token };
}

export async function authenticateAndFindUser(req: NextApiRequest) {
  const { isAuthenticated, token } = await auth(req);

  if (!isAuthenticated || !token?.email) {
    throw { status: 401, message: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: token.email,
    },
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
}
