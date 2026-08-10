import Hero from "@/components/Home/Hero";
import CategorySection from "@/components/Home/Categories";
import FeaturedArticles from "@/components/Home/FeaturedArticles";
export default function Home() {
  return (
    <main className="container mx-auto space-y-16 px-4">
      <Hero />
      <FeaturedArticles />
      <CategorySection />
    </main>
  );
}