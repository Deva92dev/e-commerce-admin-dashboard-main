import Category from "@/components/custom-ui/Category";
import Hero from "@/components/custom-ui/Hero";
import LatestProducts from "@/components/custom-ui/LatestProducts";
import Services from "@/components/custom-ui/Services";

// before deploying check for razorpay deployment videos
export default function Home() {
  return (
    <main>
      <Hero />
      <Category />
      <LatestProducts />
      <Services />
    </main>
  );
}
