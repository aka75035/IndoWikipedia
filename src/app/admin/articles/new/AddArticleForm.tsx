"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddArticleForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    slug: "",
    image: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create article");
      return;
    }

    alert("Article Created Successfully");

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-xl shadow"
    >
      <div>
        <label className="font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="font-medium">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="font-medium">Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="font-medium">Image URL</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="font-medium">Summary</label>
        <textarea
          name="summary"
          rows={4}
          value={form.summary}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="font-medium">Content</label>
        <textarea
          name="content"
          rows={12}
          value={form.content}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
      >
        Create Article
      </button>
    </form>
  );
}