import { getCollection, getProducts } from "@/lib/actions";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://127.0.0.1:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const collections = await getCollection();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product._id}`,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/collections/${collection._id}`,
    })
  );

  // const productEntries = await generateProductSitemapEntries();
  // const collectionEntries = await generateCollectionSitemapEntries();

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment_success`,
    },
    ...productEntries,
    ...collectionEntries,
  ];
}
