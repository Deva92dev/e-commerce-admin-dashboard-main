import Category from "@/components/custom-ui/Category";
import Hero from "@/components/custom-ui/Hero";
import LatestProducts from "@/components/custom-ui/LatestProducts";
import Services from "@/components/custom-ui/Services";
import { getCollection } from "@/lib/actions/collections.actions";
import { getProducts } from "@/lib/actions/products.actions";
import { ProductType } from "@/lib/types";

// before deploying check for razorpay deployment videos
export default async function Home() {
  const latestProducts: ProductType[] = await getProducts();
  const collection = await getCollection();

  return (
    <main>
      <Hero />
      <Category collection={collection} />
      <LatestProducts latestProducts={latestProducts} />
      <Services />
    </main>
  );
}
