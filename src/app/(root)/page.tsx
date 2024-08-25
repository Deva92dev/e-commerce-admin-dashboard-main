import Category from '@/components/custom-ui/Category';
import Hero from '@/components/custom-ui/Hero';
import LatestProducts from '@/components/custom-ui/LatestProducts';
import Services from '@/components/custom-ui/Services';

// Spacing must be consistent on all pages, have skeletons when needed as fallback ui, upon clicking the hero go to products page for everything involving around products, also set discounted price feature for each product
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

// className='px-4 md:px-8 lg:px-16 xl:px-32' apply this every page
