import type { Article } from "@/data/articles";
import Image from "next/image";
import Link from "next/link";
type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({article}: ArticleCardProps){
  return(
  <div className="overflow-hidden group rounded-xl shadow-md transition hover:shadow-xl">
    <Link href={`/article/${article.slug}`}>
      <Image
        src={article.image}
        alt={article.title}
        width={200}
        height={200}
        className="h-52 w-full object-cover overflow-hidden transition group-hover:scale-105"
      />
      <h2 className="transition group-hover:text-blue-600">
        {article.title}
      </h2>
      <p className="max-w-2xl">{article.summary}</p>
    </Link>
  </div>
  );
}