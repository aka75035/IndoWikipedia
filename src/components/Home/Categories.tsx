import { getCategories } from "@/lib/articles";
import Link from "next/link";

export default function CategorySection() {
  const data = getCategories();
  return (
  <div>
    <h2>Explore Categories</h2>
    {data.map(category => 
      <Link href={`/category/${category.toLowerCase()}`} key={category} >{category}</Link>
    )}
  </div>
  );
}