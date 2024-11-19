import { Metadata } from "next";

import CollectionForm from "@/app/(dashboard)/components/collections/CollectionForm";

export const metadata: Metadata = {
  title: "Admin Create Collection - Own Closet",
};

const CreateCollectionsPage = () => {
  return <CollectionForm />;
};

export default CreateCollectionsPage;
