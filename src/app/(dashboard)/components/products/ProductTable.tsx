'use client';

import { DataTable } from '@/components/custom-ui/Data-Table';
import { ProductType } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { columns } from './ProductColumn';

const ProductTable = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products`, {
        method: 'GET',
      });
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.log(`ProductTable_API`, error);
      toast.error('Something went wrong in ProductTable File.');
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <DataTable columns={columns} data={product} searchKey='title' />
    </>
  );
};

export default ProductTable;
