"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STARS = [1, 2, 3, 4, 5];

const STAR_LABEL: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
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
  const activeStar = hoverStar || rating;

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
      <main className="mx-auto w-full max-w-[560px] px-6 py-16">
        <h1 className="text-xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-sm text-muted">No restaurant has that ID.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-10">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        Write a review
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {restaurantName ? restaurantName : "…"}
      </h1>

      <section className="mt-10 rounded-xl border border-line bg-white p-6">
        <h2 className="text-sm font-medium">Your rating</h2>

        <div className="mt-4 flex items-center gap-2">
          {STARS.map((n) => {
            const filled = n <= activeStar;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverStar(n)}
                onMouseLeave={() => setHoverStar(0)}
                className="cursor-pointer p-0.5 transition-transform hover:scale-110"
              >
                <svg
                  width="34"
                  height="34"
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
          <span className="ml-3 text-sm text-muted">
            {rating > 0 ? STAR_LABEL[rating] : "Select a rating"}
          </span>
        </div>
      </section>

      <section className="mt-8">
        <label htmlFor="comment" className="text-sm font-medium">
          Your comment
        </label>
        <textarea
          id="comment"
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us how it was…"
          className="mt-3 w-full resize-none rounded-xl border border-line bg-white p-4 text-base leading-relaxed placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </section>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-line bg-white px-4 py-3 text-sm text-foreground"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`mt-8 w-full rounded-lg px-5 py-3 text-sm font-medium transition-colors ${
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