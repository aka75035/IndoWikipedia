"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
};

export default function Pagination({
  page,
  totalPages,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageNo = Math.min(
    Math.max(page || 1, 1),
    totalPages
  );

  function changePage(newPage: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(newPage));

    router.push(
      `/admin/articles?${params.toString()}`
    );
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous */}
      {pageNo > 1 && (
        <button
          className="rounded-md bg-gray-300 px-3 py-2 text-sm text-black transition hover:bg-gray-400 hover:text-white"
          onClick={() =>
            changePage(pageNo - 1)
          }
        >
          Previous
        </button>
      )}

      {/* Page numbers */}
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() =>
            changePage(pageNumber)
          }
          className={`rounded-md px-3 py-2 text-sm transition ${
            pageNumber === pageNo
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Next */}
      {pageNo < totalPages && (
        <button
          className="rounded-md bg-gray-300 px-3 py-2 text-sm text-black transition hover:bg-gray-400 hover:text-white"
          onClick={() =>
            changePage(pageNo + 1)
          }
        >
          Next
        </button>
      )}
    </div>
  );
}