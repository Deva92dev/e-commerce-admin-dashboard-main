'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CollectionType } from '@/lib/types';
import Delete from '@/components/custom-ui/Delete';
import UploadImages from '@/components/custom-ui/UploadImageToCloudinary';

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title  must not less than 2 character' })
    .max(20, {
      message: 'Title  must not  greater than 20 characters',
    }),
  description: z
    .string()
    .min(1, {
      message: 'Description  must not less than 20 character',
    })
    .max(500, {
      message: 'Description  must not greater than 500 characters',
    }),
  image: z.string({ message: 'Please choose a file to upload' }),
});

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionForm = ({ initialData }: CollectionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: '',
          description: '',
          image: '',
        },
  });

  // if accidentally press enter key (for title or description key inputs)
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleUploadSuccess = (urls: string[]) => {
    if (urls.length > 0) {
      form.setValue('image', urls[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form Values:', values);

    if (!values.image || !values.title) {
      toast.error('Please provide image and title');
      return;
    }

    try {
      setIsLoading(true);
      const url = initialData
        ? `/api/collections/${initialData._id}`
        : `/api/collections`;
      const response = await fetch(url, {
        method: 'POST',
        // values parameter
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setIsLoading(false);
        toast.success(`collection is ${initialData ? 'updated' : 'created'}`);
        window.location.href = '/admin/collections';
        router.push('/admin/collections');
      }
    } catch (error) {
      console.log(['CollectionForm_POST_API'], error);
      toast.error('Something went wrong, Please try again later');
    }
  };

  return (
    <div className='p-12'>
      {initialData ? (
        <div className='flex itc justify-between'>
          <h2 className='text-3xl font-semibold'>Edit Collection</h2>
          <Delete item='collection' id={initialData._id} />
        </div>
      ) : (
        <h2 className='text-3xl font-semibold'>Create Collection</h2>
      )}

      <Separator className='bg-gray-600 mt-2 mb-8' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            defaultValue='title'
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder='title'
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
            defaultValue='description'
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='description'
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
            defaultValue='image'
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel className=''>Image</FormLabel>
                <FormControl>
                  <UploadImages
                    multiple={false}
                    onUploadSuccess={handleUploadSuccess}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row gap-20'>
            <Button type='submit' className='bg-blue-600'>
              Submit
            </Button>
            <Button
              type='button'
              className='bg-blue-600'
              onClick={() => router.push('/admin/collections')}
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
