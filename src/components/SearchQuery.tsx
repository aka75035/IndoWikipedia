"use client";

import { useSearchParams } from "next/navigation";

export default function SearchQuery() {
  const searchParams = useSearchParams();

  const q = searchParams.get("q");

  return <p>{q}</p>;
}