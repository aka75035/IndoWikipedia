"use client";

import {
  useState,
  type ReactNode,
} from "react";

type Props = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function CollapsibleSection({
  title,
  description,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        <span
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-200 p-5">
          {children}
        </div>
      )}
    </section>
  );
}