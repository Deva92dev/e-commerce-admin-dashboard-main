'use client';

import { DataTable } from '@/components/custom-ui/Data-Table';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { columns } from './CollectionColumn';

const CollectionTable = () => {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'GET',
      });
      const data = await response.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.log(['CollectionForm_GET_API'], error);
      toast.error('Something went wrong, Please try again later');
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  // console.log(collections);

  return (
    <>
      <DataTable columns={columns} data={collections} searchKey='title' />
    </>
  );
};

export default CollectionTable;
