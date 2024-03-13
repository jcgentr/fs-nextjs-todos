import { NextApiRequest } from "next";
import { auth } from "@/lib/auth";

export async function GET(req: NextApiRequest) {
  const { isAuthenticated, token } = await auth(req);

  if (isAuthenticated) {
    return Response.json(token);
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
