import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export async function auth(req: NextApiRequest) {
  const token = await getToken({ req });
  return { isAuthenticated: token !== null, token };
}
