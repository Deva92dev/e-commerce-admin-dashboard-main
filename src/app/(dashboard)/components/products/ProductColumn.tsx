'use client';

import { ColumnDef } from '@tanstack/react-table';
import Delete from '@/components/custom-ui/Delete';
import Link from 'next/link';
import { ProductType } from '@/lib/types';

// upon clicking on Link, we get respective collection information on their respective pages
export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link
        href={`/admin/products/${row.original._id}`}
        className='hover:text-blue-600'
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <p>{row.original.category}</p>,
  },
  {
    accessorKey: 'collections',
    header: 'Collections',
    cell: ({ row }) => (
      <p>{row.original.collections.map((item) => item.title).join(' , ')}</p>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => <p>{row.original.price}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <Delete item='product' id={row.original._id} />,
  },
];
