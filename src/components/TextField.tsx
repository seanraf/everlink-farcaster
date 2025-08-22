import React from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '../lib/utils';

interface TextFieldProps {
  id: string;
  label: string | React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ 
    id, 
    label, 
    value, 
    onChange, 
    error, 
    multiline = false, 
    rows = 2, 
    placeholder, 
    className,
    disabled = false,
    required = false
  }, ref) => {
    const baseInputClasses = "rounded-lg bg-gray-100 border border-gray-300 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors";
    const errorClasses = error ? "border-red-500" : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
    
    const inputClasses = cn(
      baseInputClasses,
      errorClasses,
      disabledClasses,
      multiline ? "resize-none" : "h-12",
      className
    );

    return (
      <div className="flex flex-col gap-2">
        <Label.Root 
          htmlFor={id} 
          className="text-gray-600 font-medium text-base"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label.Root>
        
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            className={inputClasses}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            className={inputClasses}
            value={value}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
          />
        )}
        
        {error && (
          <div className="text-xs text-red-500 mt-1">
            {error}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField'; 