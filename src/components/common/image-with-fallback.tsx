'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: boolean;
}

const ImageWithFallback = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackIcon = false,
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    if (fallbackIcon) {
      return (
        <div 
          className={`flex items-center justify-center bg-muted rounded ${className}`}
          style={{ width, height }}
        >
          <User className="w-1/2 h-1/2 text-muted-foreground" />
        </div>
      );
    }
    
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded ${className}`}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
