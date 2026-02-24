import React from 'react';

export const EasyEmailScope: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={`ee ${className || ''}`.trim()}>{children}</div>;
};
