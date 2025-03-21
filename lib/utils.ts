import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Languages from "@/languages.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguages() {
  return Languages;
}
