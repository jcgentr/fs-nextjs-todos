import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { isAuthenticated, token } = await auth(req);

  if (isAuthenticated) {
    return Response.json(token);
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
