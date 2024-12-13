import Category from "@/components/custom-ui/Category";
import Hero from "@/components/custom-ui/Hero";
import LatestProducts from "@/components/custom-ui/LatestProducts";
import Services from "@/components/custom-ui/Services";

// before deploying check for razorpay deployment videos, add sitemap and robot.ts code
export default async function Home() {
  return (
    <main className="bg-landingPage-background">
      <Hero />
      <Category />
      <LatestProducts />
      <Services />
    </main>
  );
}
