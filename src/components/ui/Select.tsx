import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: Option | null;
  onChange: (value: Option) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  error,
}) => {
  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className={`
            relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border
            focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 
            focus-visible:ring-primary-500 focus-visible:ring-opacity-75
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}>
            <span className={`block truncate ${!value ? 'text-gray-500' : ''}`}>
              {value ? value.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          
          <Listbox.Options className="
            absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 
            text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
          ">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option}
                className={({ active }) => `
                  relative cursor-pointer select-none py-2 pl-10 pr-4
                  ${active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'}
                `}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option.label}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;