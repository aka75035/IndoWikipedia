"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = ["All", "History", "Science", "Sports"];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const query = params.toString();

    router.push(
      query
        ? `/admin/articles?${query}`
        : "/admin/articles"
    );
  }

  return (
    <div>
      <label>Category</label>

      <select onChange={handleChange}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}