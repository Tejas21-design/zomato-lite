import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">zomato lite</h1>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
        Restaurant reviews, computed live from a Postgres database. No stored
        averages.
      </p>
      <Link
        href="/restaurant/1"
        className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        View Ludhiana Burrito
      </Link>
    </main>
  );
}