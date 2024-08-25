
import Filters from '@/components/custom-ui/Filters';
import ProductCard from '@/components/custom-ui/ProductCard';
import ProductCardSkeleton from '@/components/custom-ui/ProductCardSkeleton';
import { Separator } from '@/components/ui/separator';
import { getProducts } from '@/lib/actions';
import { Suspense } from 'react';

// do filtering must
const ProductPage = async () => {
  const products = await getProducts();

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 my-8'>
      <h1>Products Page</h1>
      <Filters products={products} />
      <Separator />
      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-20'>
        {products.map((product) => (
          <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
          <ProductCard product={product} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
