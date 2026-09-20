import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  let body: { restaurantId?: unknown; rating?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { rating, comment, restaurantId } = body;

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return Response.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return Response.json({ error: "Comment must not be empty." }, { status: 400 });
  }

  if (
    typeof restaurantId !== "number" ||
    !Number.isInteger(restaurantId) ||
    restaurantId < 1
  ) {
    return Response.json(
      { error: "Restaurant ID must be a positive whole number." },
      { status: 400 }
    );
  }

  const restaurant = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
  if (restaurant.length === 0) {
    return Response.json(
      { error: "Restaurant with that ID does not exist." },
      { status: 400 }
    );
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id
  `;

  return Response.json({ success: true, reviewId: inserted[0].id }, { status: 201 });
}