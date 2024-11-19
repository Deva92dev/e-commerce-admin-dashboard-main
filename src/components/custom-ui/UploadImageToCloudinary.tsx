/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Loader from "./Loader";

interface UploadImagesProps {
  multiple?: boolean;
  onUploadSuccess?: (url: string[]) => void;
}

interface Resource {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

const UploadImages: React.FC<UploadImagesProps> = ({
  multiple = false,
  onUploadSuccess,
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSuccess = (result: any, { widget }: { widget: any }) => {
    setLoading(false);
    const newResource = result?.info as Resource;
    if (newResource) {
      setResources((prevResources) => {
        const updatedResources = multiple
          ? [...prevResources, newResource]
          : [newResource];
        const urls = updatedResources.map(
          (resource) => `${resource.secure_url}/f_auto,q_auto`
        );
        if (onUploadSuccess) {
          onUploadSuccess(urls);
        }
        return updatedResources;
      });
    }
    // widget.close();
  };

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleSuccess}
        options={{ multiple }}
        onOpen={() => setLoading(true)}
      >
        {({ open }) => {
          function handleOnClick() {
            if (!multiple) setResources([]);
            open();
          }
          return (
            <button
              type="button"
              onClick={handleOnClick}
              className="bg-blue-500 p-2 rounded-lg text-white"
            >
              {multiple ? "Upload Images" : "Upload an Image"}
            </button>
          );
        }}
      </CldUploadWidget>

      {loading && <Loader />}

      {/* add delete button around each image for easy deletion */}
      <div className="mt-4 flex flex-row ">
        {resources.map((resource) => (
          <Image
            key={resource.public_id}
            src={`${resource.secure_url}/f_auto,q_auto`}
            width={300}
            height={300}
            alt={resource.public_id}
            className="w-32 h-32 object-cover mr-2 mb-2"
          />
        ))}
      </div>
    </div>
  );
};

export default UploadImages;
