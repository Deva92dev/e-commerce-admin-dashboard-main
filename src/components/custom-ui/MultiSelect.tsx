'use client';

import { useState } from 'react';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { CollectionType } from '@/lib/types';

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  const selectAbles = collections.filter(
    (collection) => !selected.includes(collection)
  );

  return (
    <div className='relative mt-2'>
      <div className='flex gap-1 flex-wrap border rounded-md p-2'>
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button
              type='button'
              className='ml-1 hover:text-red-1'
              onClick={() => onRemove(collection._id)}
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}
        <input
          className='flex-1 outline-none'
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
      </div>

      {open && selectAbles.length > 0 && (
        <div className='absolute w-full z-30 top-full mt-1 overflow-auto border rounded-md shadow-md bg-white max-h-60'>
          {selectAbles.map((collection) => (
            <div
              key={collection._id}
              className='px-2 py-1 cursor-pointer hover:bg-gray-100'
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(collection._id);
                setInputValue('');
              }}
            >
              {collection.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
