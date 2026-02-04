import { Hero } from "@/components/hero"
import { StockTicker } from "@/components/stock-ticker"
import { FeaturedPosts } from "@/components/featured-posts"

export default function Home() {
  return (
    <div className="min-h-screen">
      <StockTicker />
      <Hero />
      <FeaturedPosts />

      {/* Latest News Grid - Can reuse FeaturedPosts logic with different query later */}

    </div>
  )
}
