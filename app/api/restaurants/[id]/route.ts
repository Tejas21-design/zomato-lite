import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

type ReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: Date;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurant = await sql`
    SELECT id, name, cuisine, area
    FROM restaurants
    WHERE id = ${restaurantId}
  `;

  if (restaurant.length === 0) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const reviews = (await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  `) as ReviewRow[];

  const averageResult = await sql`
    SELECT
      COUNT(*) AS total,
      ROUND(AVG(rating)::numeric, 1) AS average
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
  `;

  const { total, average } = averageResult[0];

  const shape = (r: ReviewRow) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at.toISOString(),
  });

  const latestReview = reviews.length > 0 ? shape(reviews[0]) : null;

  return Response.json({
    name: restaurant[0].name,
    cuisine: restaurant[0].cuisine,
    area: restaurant[0].area,
    averageRating: average === null ? null : Number(average),
    totalReviews: Number(total),
    latestReview,
    reviews: reviews.slice(1).map(shape),
  });
}