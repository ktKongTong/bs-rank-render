import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function countryEmoji(code:string) {
  // console.log(code)
  return countryCodeToFlagEmoji(code)
}