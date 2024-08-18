'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CollectionType } from '@/lib/types';
import Delete from '@/components/custom-ui/Delete';
import Link from 'next/link';

// upon clicking on Link, we get respective collection information on their respective pages
export const columns: ColumnDef<CollectionType>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link
        href={`/admin/collections/${row.original._id}`}
        className='hover:text-blue-600'
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'products',
    header: 'Products',
    cell: ({ row }) => <p>{row.original.products.length}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <Delete item='collection' id={row.original._id} />,
  },
];
