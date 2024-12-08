import Category from "@/components/custom-ui/Category";
import Hero from "@/components/custom-ui/Hero";
import LatestProducts from "@/components/custom-ui/LatestProducts";
import Services from "@/components/custom-ui/Services";
import { getCollection, getProducts } from "@/lib/actions";
import { ProductType } from "@/lib/types";
import { notFound } from "next/navigation";

// before deploying check for razorpay deployment videos
export default async function Home() {
  const latestProducts: ProductType[] = await getProducts();
  const collection = await getCollection();

  if (!collection || !latestProducts) {
    notFound();
  }

  return (
    <main className="bg-landingPage-background">
      <Hero />
      <Category collection={collection} />
      <LatestProducts latestProducts={latestProducts} />
      <Services />
    </main>
  );
}
