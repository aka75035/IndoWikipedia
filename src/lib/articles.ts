import { articles } from "@/data/articles";
import { connectDB } from "./mongodb";
import Article from "@/models/Article";
import { type CreateArticleInput, type UpdateArticleInput} from "@/lib/validations/article";

export async function getArticles(page?: number) {
  await connectDB();
  const total = await Article.countDocuments();
  const limit = 10;
  const totalPages = Math.max(Math.ceil(total/limit),1);
  const pageNo = Math.min(
    Number.isInteger(page) ? Math.max(page || 1, 1):1,
    totalPages,
  );
  const skip = (pageNo - 1)*limit;
  const articles = await Article.find().skip(skip).limit(limit);
  return{
    articles,
    total,
    page: pageNo,
    totalPages,
  };
}
export async function getArticle(slug: string) {
  await connectDB();
  return Article.findOne({slug});
}


export async function createArticle(body: CreateArticleInput) {
  await connectDB();
  return Article.create(body);
}


export async function updateArticle(slug: string, body: UpdateArticleInput) {
  await connectDB();
  return Article.findOneAndUpdate({slug},body,{new: true,});
}
export async function deleteArticle(slug: string) {
  await connectDB();
  return Article.findOneAndDelete({slug});
}

export async function searchArticles(query?: string, category?: string, page?: number) {
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
  const total = await Article.countDocuments(filter);
  const limit = 10;
  const totalPages = Math.max(Math.ceil(total/limit),1);
  const pageNo = Math.min(
    Number.isInteger(page) ? Math.max(page || 1, 1): 1,
    totalPages,
  );
  const skip = (pageNo - 1)*limit;
  const articles = await Article.find(filter).skip(skip).limit(limit);
  
  return{
    articles,
    total,
    page:pageNo,
    totalPages,
  }
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