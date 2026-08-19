"use client";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export default function HeadingBlockEditor({
  content,
  onChange,
}: Props) {
  return (
    <input
      type="text"
      value={content}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder="Heading text..."
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}