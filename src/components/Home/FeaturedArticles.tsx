import { getArticles } from "@/lib/articles";
import ArticleCard from "../Article/ArticleCard";

export default async function FeaturedArticles() {
  const articles = await getArticles();
  const firstThree = articles.slice(0, 3);
  return (
    <div className="flex">
    {firstThree.map(article => (
      <ArticleCard  key={article.slug} article={article} />
    ))}
    </div>
  )
}