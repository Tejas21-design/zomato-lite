"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "" : "text-line"}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<RestaurantData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${params.id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      });
  }, [params.id]);

  if (notFound) {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-16">
        <h1 className="text-xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-sm text-muted">No restaurant has that ID.</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-16 text-sm text-muted">
        Loading…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[560px] px-6 py-12">
      <header className="border-b border-line pb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm text-muted">
          {data.cuisine} · {data.area}
        </p>
      </header>

      {data.totalReviews === 0 ? (
        <section className="py-16 text-center">
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="mt-2 text-sm text-muted">Be the first to leave one.</p>
          <Link
            href={`/review/${params.id}`}
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
          >
            Write a review
          </Link>
        </section>
      ) : (
        <>
          <section className="flex items-end gap-3 py-8">
            <span className="text-6xl font-semibold leading-none tracking-tight">
              {data.averageRating}
            </span>
            <span className="pb-1 text-sm text-muted">
              {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
            </span>
          </section>

          <section className="rounded-xl border border-line bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Latest review
            </p>
            {data.latestReview && (
              <div className="mt-3">
                <Stars rating={data.latestReview.rating} />
                <p className="mt-2 text-base leading-relaxed">{data.latestReview.comment}</p>
                <p className="mt-2 text-xs text-muted">{formatDate(data.latestReview.createdAt)}</p>
              </div>
            )}
          </section>

          {data.reviews.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
                Earlier reviews
              </h2>
              <ul className="divide-y divide-line">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <Stars rating={review.rating} />
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-muted">{formatDate(review.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10">
            <Link
              href={`/review/${params.id}`}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
            >
              Write a review
            </Link>
          </div>
        </>
      )}
    </main>
  );
}