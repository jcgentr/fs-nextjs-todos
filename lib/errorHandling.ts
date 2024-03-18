interface ApiError {
  status: number;
  message: string;
}

export function handleApiError(error: unknown): Response {
  if (typeof error === "object" && error !== null && "status" in error) {
    const typedError = error as ApiError;
    return new Response(JSON.stringify({ error: typedError.message }), {
      status: typedError.status,
    });
  }

  // Fallback for unexpected errors
  return new Response(
    JSON.stringify({ error: "An unexpected error occurred" }),
    {
      status: 500,
    }
  );
}
