import AddArticleForm from "./AddArticleForm";

export default function AddArticlePage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">
        Add New Article
      </h1>

      <AddArticleForm />
    </div>
  );
} 