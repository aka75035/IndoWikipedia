import Hero from "@/components/Home/Hero";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedArticles from "@/components/Home/FeaturedArticles";
import NewsAroundRegion from "@/components/Home/NewsAroundRegion";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "IndoWikipedia",
  description:
    "Explore knowledge about India, including history, geography, culture, people, cities, and more.",
};

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