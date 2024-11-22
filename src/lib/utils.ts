import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// by using cn of utils, make highlights of current link
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
