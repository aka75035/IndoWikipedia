"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
};

export default function ProfileForm() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setMessage("Unable to load profile");
          return;
        }

        const data = await response.json();

        setUser(data.user);
        setName(data.user.name);
      } catch {
        setMessage("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setUser(data.user);
      setName(data.user.name);
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>{message || "Unable to load profile"}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          value={user.email}
          disabled
          className="w-full rounded border bg-gray-100 p-2"
        />
      </div>

      {message && <p>{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}