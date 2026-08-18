import Hero from "@/components/Home/Hero";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedArticles from "@/components/Home/FeaturedArticles";
import NewsAroundRegion from "@/components/Home/NewsAroundRegion";
export default function Home() {
  return (
    <main className="container mx-auto space-y-16 px-4">
      <Hero />
      <CategorySection />
      <FeaturedArticles />
      <NewsAroundRegion />
    </main>
  );
}