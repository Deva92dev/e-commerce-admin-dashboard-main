'use client';
import { useEffect, useState } from 'react';
import { CollectionType } from '@/lib/types';
import Loader from '@/components/custom-ui/Loader';
import CollectionForm from '@/app/(dashboard)/components/collections/CollectionForm';

const CollectionDetailsPage = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const [loading, setLoading] = useState(false);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  const getCollectionDetails = async () => {
    try {
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: 'GET',
      });
      const data = await res.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (error) {
      console.log('[CollectionId_GET]', error);
    }
  };

  useEffect(() => {
    getCollectionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // so that we can update the collection
  return loading ? (
    <Loader />
  ) : (
    <CollectionForm initialData={collectionDetails} />
  );
};

export default CollectionDetailsPage;
