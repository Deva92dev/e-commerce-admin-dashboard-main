"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface MultiTextProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiText = ({
  placeholder,
  value,
  onChange,
  onRemove,
}: MultiTextProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (item: string) => {
    onChange(item);
    setInputValue("");
  };

  return (
    <div>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        // for adding tags
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
          }
        }}
      />
      <div className="flex flex-wrap gap-1">
        {value.map((tag, index) => (
          <Badge key={index} className=" bg-gray-600 text-white mt-4 p-2">
            {tag}
            <Button
              className="ml-1 rounded-full bg-transparent outline-none hover:bg-red-500"
              size="sm"
              onClick={() => onRemove(tag)}
            >
              <X className="h-3 w-3 text-white" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MultiText;
