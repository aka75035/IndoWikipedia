import ArticleCard from "@/components/Article/ArticleCard";
import { searchArticles } from "@/lib/articles";


type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: Props) {
  const { q } = await searchParams;
  const results = await searchArticles(q ?? "");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map(result => (
        <ArticleCard key={result.slug} article={result}/>
      ))}
    </div>
  )
}