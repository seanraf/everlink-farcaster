import React from 'react';
import { cn } from '../lib/utils';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Box.displayName = 'Box'; 