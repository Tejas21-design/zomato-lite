import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL);

console.log("Dropping old tables (so this is safe to re-run)...");
await sql`DROP TABLE IF EXISTS reviews;`;
await sql`DROP TABLE IF EXISTS restaurants;`;

console.log("Applying schema...");
const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
for (const statement of statements) {
  await sql.query(statement);
}

console.log("Seeding restaurant...");
const [restaurant] = await sql`
  INSERT INTO restaurants (name, cuisine, area)
  VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32')
  RETURNING id, name, cuisine, area;
`;
console.log(restaurant);

console.log("Seeding reviews...");
await sql`
  INSERT INTO reviews (restaurant_id, rating, comment, created_at)
  VALUES
    (${restaurant.id}, 5, 'Paneer burrito is unreal', NOW() - INTERVAL '8 days'),
    (${restaurant.id}, 4, 'Good, but slow service', NOW() - INTERVAL '6 days'),
    (${restaurant.id}, 4, 'Solid. Would repeat.', NOW() - INTERVAL '2 days');
`;

console.log("Done. Rows in the database:");
console.log(await sql`SELECT * FROM restaurants;`);
console.log(
  await sql`SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at;`
);