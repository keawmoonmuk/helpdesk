
import React from 'react';
import { Badge } from './badge';
import { VariantProps } from 'class-variance-authority';

interface BadgeWrapperProps extends VariantProps<typeof Badge> {
  children: React.ReactNode;
  className?: string;
}

const BadgeWrapper: React.FC<BadgeWrapperProps> = ({ 
  children, 
  variant = "default",
  className = "" 
}) => {
  return (
    <Badge variant={variant} className={className}>
      {children}
    </Badge>
  );
};

export default BadgeWrapper;
