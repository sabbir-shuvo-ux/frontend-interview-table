import { query } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const countResult = await query("SELECT COUNT(*) FROM users");
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      "SELECT id, first_name, last_name, email, phone FROM users ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    return Response.json({
      data: result.rows,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
