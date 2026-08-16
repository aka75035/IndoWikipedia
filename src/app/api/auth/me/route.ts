import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.user) {
      return Response.json(
        {
          success: false,
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
      {
        success: true,
        user: auth.user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get admin profile error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}