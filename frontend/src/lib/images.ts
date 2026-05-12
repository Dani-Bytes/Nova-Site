import fallbackProductImage from "@/assets/p1.jpg";

export const productImageFallback = fallbackProductImage;

export const resolveProductImage = (source?: string | null) => {
  if (source && source.trim()) {
    return source;
  }
  return productImageFallback;
};
