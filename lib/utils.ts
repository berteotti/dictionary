import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Languages from "@/languages.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguages() {
  return Languages;
}

export function getLanguagesObject() {
  return Languages.reduce<Record<string, (typeof Languages)[number]>>(
    (languageObject, language) => {
      languageObject[language.code] = language;
      return languageObject;
    },
    {}
  );
}
