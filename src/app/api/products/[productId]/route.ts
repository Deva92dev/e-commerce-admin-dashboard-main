import Collection from '@/lib/models/Collections';
import Product from '@/lib/models/Product';
import { ConnectDB } from '@/lib/mongoDB';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  try {
    ConnectDB();

    const product = await Product.findById(params.productId).populate({
      path: 'collections',
      model: Collection,
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: 'Product not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(`Products_GET`, error);
    return new NextResponse('Something went wrong in dynamic ProductId route', {
      status: 500,
    });
  }
};

// for updating the product
export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await ConnectDB();

    const product = await Product.findById(params.productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: 'Product not found' }),
        { status: 404 }
      );
    }

    const {
      title,
      description,
      media,
      tags,
      collections,
      category,
      price,
      sizes,
      color,
    } = await req.json();

    if (
      !title ||
      !description ||
      !media ||
      !sizes ||
      !color ||
      !price ||
      !category
    ) {
      return new NextResponse(
        'Please provide all necessary details about product for update',
        { status: 400 }
      );
    }

    // included in new data not in prev data
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    // included in prev data but not in new data
    const removeCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );

    // update collections
    await Promise.all([
      // update the collection with this product
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),

      // update the collection without this product
      ...removeCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // updated product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections,
        price,
        sizes,
        color,
        tags,
      },
      { new: true }
    ).populate({ path: 'collections', model: Collection });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log('ProductId_API', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await ConnectDB();
    const product = await Product.findByIdAndDelete(params.productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: 'Product not found' }),
        { status: 404 }
      );
    }

    // update the collection after deletion for single document
    // await Collection.updateOne(
    //   { products: params.productId },
    //   {
    //     $pull: { products: params.productId },
    //   }
    // );

    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse('Product is deleted', { status: 200 });
  } catch (error) {
    console.log('ProductId_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
