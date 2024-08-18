import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import ProductTable from '../../components/products/ProductTable';

const ProductsPage = () => {
  return (
    <main className='p-12'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-3xl font-semibold text-gray-700'>Products</h1>
        <Link href='/admin/products/new'>
          <Button className='bg-blue-600'>
            <Plus className='h-4 w-4 mr-2' /> Create Product
          </Button>
        </Link>
      </div>
      <Separator className='bg-gray-600 mt-2 mb-8' />
      <ProductTable />
    </main>
  );
};

export default ProductsPage;
