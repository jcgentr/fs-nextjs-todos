import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, raw: true });

  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
    return new Response(JSON.stringify(token), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
