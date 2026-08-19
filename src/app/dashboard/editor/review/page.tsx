import { redirect } from "next/navigation";
import Link from "next/link";

import { requireEditor } from "@/lib/auth";

import {
  getEditorReviewQueue,
} from "@/lib/services/dashboard/editor.service";

import ReviewQueue from "@/components/Dashboard/Editor/ReviewQueue/ReviewQueue";

export default async function EditorReviewQueuePage() {
  const auth = await requireEditor();

  if (auth.status !== 200 || !auth.user) {
    redirect("/login");
  }

  const reviewQueue =
    await getEditorReviewQueue();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/dashboard/editor"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Dashboard
        </Link>

        <div className="mt-5">
          <p className="text-sm font-medium text-blue-600">
            Editorial
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Review Queue
          </h1>

          <p className="mt-2 text-slate-500">
            Review articles submitted by
            contributors before publication.
          </p>
        </div>
      </div>

      {/* Queue */}
      <ReviewQueue
        articles={reviewQueue}
      />
    </main>
  );
}