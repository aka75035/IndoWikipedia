import { getArticle } from "@/lib/articles";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string
  }>;
};

export async function generateMetadata({params}:Props){
  const { slug } = await params;
  const article = await getArticle(slug);
  return{
    title: `${article?.title} | IndoWikipedia`,
    description: `Read about ${slug}`,
  };
}

export default async function Article({params}: Props) {
  const {slug} = await params;
  const article = await getArticle(slug);
  if(!article){
    notFound();
  }
  return (
    <>
    <h1>{article.title}</h1>
    <h2>{article.summary}</h2>
    </>
  );
}