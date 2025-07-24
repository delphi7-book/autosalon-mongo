import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getImageUrl(imagePath: string): string {
  // Если путь уже содержит полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Если путь начинается с /, добавляем базовый URL
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Иначе добавляем / в начало
  return `/${imagePath}`;
}
