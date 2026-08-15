import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return Response.json(
      {
        message:
          auth.status === 401
            ? "Unauthorized"
            : "Forbidden",
      },
      {
        status: auth.status,
      }
    );
  }

  return Response.json(
    { user: auth.user },
    { status: 200 }
  );
}