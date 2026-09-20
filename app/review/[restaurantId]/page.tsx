"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STARS = [1, 2, 3, 4, 5];

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${params.restaurantId}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setRestaurantName(json.name);
      });
  }, [params.restaurantId]);

  const canSubmit = !submitting && rating >= 1 && comment.trim().length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: Number(params.restaurantId),
        rating,
        comment,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      setError(body.error);
      setSubmitting(false);
      return;
    }

    router.push(`/restaurant/${params.restaurantId}`);
  };

  if (notFound) {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-16">
        <h1 className="text-xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-sm text-muted">No restaurant has that ID.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[560px] px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        {restaurantName ? restaurantName : "…"}
      </h1>

      <section className="mt-10">
        <h2 className="text-sm text-muted">Your rating</h2>
        <div className="mt-3 flex gap-2">
          {STARS.map((n) => {
            const filled = n <= rating;
            return (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                onClick={() => setRating(n)}
                className="cursor-pointer p-1"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  className={filled ? "text-accent" : "text-line"}
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <label htmlFor="comment" className="text-sm text-muted">
          Your comment
        </label>
        <textarea
          id="comment"
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us how it was…"
          className="mt-3 w-full rounded-xl border border-line bg-white p-4 text-base leading-relaxed placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </section>

      {error && (
        <p className="mt-6 rounded-lg border border-line bg-white px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`mt-8 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
          canSubmit
            ? "bg-accent text-white hover:opacity-90"
            : "cursor-not-allowed bg-line text-muted"
        }`}
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </main>
  );
}