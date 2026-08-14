"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
};

export default function Pagination({ page, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNo = Math.min(
    Math.max(page || 1, 1),
    totalPages
  );

  function changePage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(pageNo));

    router.push(`/admin/articles?${params.toString()}`);
  }

  return (
    <div className="flex justify-center items-center gap-5">
      {page > 1 && (
        <button className ="p-2 bg-gray-300 hover:bg-gray-400 hover:text-white text-black transition-smooth" onClick={() => changePage(page - 1)}>
          Previous
        </button>
      )}

      <div>
        Page {pageNo} of {totalPages}
      </div>

      {page < totalPages && (
        <button className ="p-2 bg-gray-300 hover:bg-gray-400 hover:text-white text-black transition-smooth" onClick={() => changePage(page + 1)}>
          Next
        </button>
      )}
    </div>
  );
}