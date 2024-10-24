/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CollectionType, ProductType } from "@/lib/types";
import Delete from "@/components/custom-ui/Delete";
import MultiText from "@/components/custom-ui/MultiText";
import MultiSelect from "@/components/custom-ui/MultiSelect";
import UploadImages from "@/components/custom-ui/UploadImageToCloudinary";
import Loader from "@/components/custom-ui/Loader";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title  must not less than 2 character" })
    .max(20, {
      message: "Title  must not  greater than 20 characters",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description  must not less than 20 character",
    })
    .max(500, {
      message: "Description  must not greater than 500 characters",
    }),
  media: z.array(z.string()).default([]),
  category: z.string(),
  collections: z.array(z.string()),
  sizes: z.array(z.string()),
  color: z.array(z.string()),
  tags: z.array(z.string()),
  price: z.coerce.number(),
});

interface ProductFormProps {
  initialData?: ProductType | null;
}

// when we get particular product, we populated it with Collection, that is why in default values

const ProductForm = ({ initialData }: ProductFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setIsLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map(
            (collection) => collection._id
          ),
        }
      : {
          title: "",
          description: "",
          media: [],
          collections: [],
          tags: [],
          sizes: [],
          color: [],
          price: 0,
          category: "",
        },
  });

  // if accidentally press enter key (for title or description key inputs)
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form Values Before Submit:", values);
    try {
      const url = initialData
        ? `/api/products/${initialData._id}`
        : `/api/products`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setIsLoading(false);
        toast.success(`product is ${initialData ? "updated" : "created"}`);
        window.location.href = "/admin/products";
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.log(["ProductForm_POST_API"], error);
      toast.error(`${error.message}`);
    }
  };

  const handleUploadSuccess = (urls: string[]) => {
    form.setValue("media", urls);
  };

  // console.log('initialData', initialData);
  // console.log('collections', collections);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="p-12">
      {initialData ? (
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Edit Product</h2>
          <Delete item="product" id={initialData._id} />
        </div>
      ) : (
        <h2 className="text-3xl font-semibold">Create Product</h2>
      )}

      <Separator className="bg-gray-600 mt-2 mb-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="description"
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Image</FormLabel>
                <FormControl>
                  <UploadImages
                    multiple={true}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (&#8377;)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="category"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((item) => item !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        collections={collections}
                        placeholder="collections"
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="sizes"
                      value={field.value}
                      onChange={(size) =>
                        field.onChange([...field.value, size])
                      }
                      onRemove={(sizeToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (item) => item !== sizeToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="color"
                      value={field.value}
                      onChange={(c) => field.onChange([...field.value, c])}
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (item) => item !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-20">
            <Button type="submit" className="bg-blue-600">
              Submit
            </Button>
            <Button
              type="button"
              className="bg-blue-600"
              onClick={() => router.push("/admin/products")}
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
