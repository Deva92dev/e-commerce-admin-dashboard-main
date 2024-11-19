import { Metadata } from "next";
import Wishlist from "@/components/custom-ui/Wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
};

const WishlistPage = async () => {
  return <Wishlist />;
};

export default WishlistPage;
