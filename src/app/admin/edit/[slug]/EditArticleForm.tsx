"use client";

import { useState } from "react";

interface Props {
  article: {
    title: string;
    summary: string;
    content: string;
    category: string;
    slug: string;
    image: string;
  };
}

export default function EditArticleForm({ article }: Props) {
  const [form, setForm] = useState(article);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/articles/${article.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Article Updated");
    } else {
      alert("Failed");
    }
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
        />
      </div>

      <div>
        <label className="font-medium">Category</label>

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="font-medium">Slug</label>

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
        />
      </div>

      <div>
        <label className="font-medium">Image URL</label>

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full mt-2 border rounded-lg px-4 py-3"
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
        />
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
      >
        Update Article
      </button>
    </form>
  );
}