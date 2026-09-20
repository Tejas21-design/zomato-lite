"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Stars } from "@/app/components/stars";

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
      <main className="mx-auto w-full max-w-[560px] px-6 py-16">
        <h1 className="text-xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-sm text-muted">No restaurant has that ID.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent"
        >
          Back to home
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6 py-16 text-sm text-muted">
        Loading…
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-10">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Restaurant
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-2 text-sm text-muted">
          {data.cuisine} · {data.area}
        </p>
      </header>

      {data.totalReviews === 0 ? (
        <section className="mt-10 rounded-xl border border-line bg-white px-6 py-16 text-center">
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="mt-2 text-sm text-muted">Be the first to leave one.</p>
          <Link
            href={`/review/${params.id}`}
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Write a review
          </Link>
        </section>
      ) : (
        <>
          <section className="mt-10 rounded-xl border border-line bg-white px-6 py-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Average rating
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-6xl font-semibold leading-none tracking-tight">
                {data.averageRating}
              </span>
              <span className="pb-1 text-sm text-muted">
                {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
              </span>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-line bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">
              Latest review
            </p>
            {data.latestReview && (
              <div className="mt-3">
                <Stars rating={data.latestReview.rating} />
                <p className="mt-3 text-base leading-relaxed">
                  {data.latestReview.comment}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {formatDate(data.latestReview.createdAt)}
                </p>
              </div>
            )}
          </section>

          {data.reviews.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
                Earlier reviews
              </h2>
              <ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-white px-6">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <Stars rating={review.rating} />
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {formatDate(review.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-8">
            <Link
              href={`/review/${params.id}`}
              className="inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Write a review
            </Link>
          </div>
        </>
      )}
    </main>
  );
}