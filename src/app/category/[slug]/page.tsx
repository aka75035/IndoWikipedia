import ArticleCard from "@/components/Article/ArticleCard";
import { getArticlesByCategory } from "@/lib/articles";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
}
export async function generateMetadata({params}:Props){
  const {slug} = await params;
  const category = slug.charAt(0).toUpperCase() + slug.slice(1);
  return{
    title: `${category} | IndoWikipedia`,
    description: `Read about ${slug}`,
  }
}

export default async function CategoryPage({params}:Props){
  const {slug} = await params;
  const articles = getArticlesByCategory(slug);
  if(articles.length === 0){
    notFound();
  }
  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
    </div>
  )
}