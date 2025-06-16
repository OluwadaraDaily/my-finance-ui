"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends Omit<NextImageProps, "onLoadingComplete"> {
  fallback?: string;
}

export function Image({ 
  className,
  fallback = "/images/fallback.svg",
  alt,
  priority,
  src,
  ...props 
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <NextImage
      className={cn(
        "transition-all duration-300",
        isLoading && "animate-pulse bg-gray-200",
        className
      )}
      alt={alt}
      src={imageSrc}
      {...props}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onLoadingComplete={() => setIsLoading(false)}
      onError={() => {
        setIsLoading(false);
        if (imageSrc !== fallback) {
          setImageSrc(fallback);
        }
      }}
      // Add default quality for better performance
      quality={props.quality || 75}
      // Add default sizes for responsive images
      sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    />
  );
} 