export type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
};

export type ProductType = {
  _id: string;
  title: string;
  description: string;
  category: string;
  collections: [CollectionType];
  media: [string];
  tags: [string];
  sizes: [string];
  color: [string];
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

export type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
};

export type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
};

export type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
};

export type ReviewType = {
  _id: string;
  customer: string;
  comment: string;
  rating: number;
};
