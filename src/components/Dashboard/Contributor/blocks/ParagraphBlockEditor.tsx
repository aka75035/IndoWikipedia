"use client";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export default function ParagraphBlockEditor({
  content,
  onChange,
}: Props) {
  return (
    <textarea
      value={content}
      onChange={(event) =>
        onChange(event.target.value)
      }
      rows={6}
      placeholder="Write paragraph content..."
      className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}