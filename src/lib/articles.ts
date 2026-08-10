import { articles } from "@/data/articles";
import { connectDB } from "./mongodb";
import Article from "@/models/Article";

export async function getArticles() {
  await connectDB();
  return await Article.find();
}
export async function getArticle(slug: string) {
  await connectDB();
  return Article.findOne({slug});
}

type CreateArticleInput = {
  title: string;
  summary: string;
  content: string;
  category: string;
  slug: string;
  image: string;
};

export async function createArticle(body: CreateArticleInput) {
  await connectDB();
  return Article.create(body);
}

type UpdateArticleInput = Partial<CreateArticleInput>;

export async function updateArticle(slug: string, body: UpdateArticleInput) {
  await connectDB();
  return Article.findOneAndUpdate({slug},body,{new: true,});
}
export async function deleteArticle(slug: string) {
  await connectDB();
  return Article.findOneAndDelete({slug});
}

export async function searchArticles(query?: string, category?: string) {
  await connectDB();
  const categories = category?.split(",");
  const filter: any = {};
  if(categories){
    filter.category = {
      $in: categories
    };
  }
  if(query){
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { summary: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ]
  }
  return Article.find(filter);
}


export function getCategories(){
  const data = articles.map(article => article.category);
  const uniqueCategories = new Set(data);
  const categories = [...uniqueCategories]
  return categories;
}

export function getArticlesByCategory(slug: string) {
  return articles.filter(
    (article) => (article.category).toLowerCase() === slug
  );
}