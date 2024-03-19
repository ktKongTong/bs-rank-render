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


export const diffConv = (diff:string) => {
  if(diff.includes('ExpertPlus')){
    return "E+"
  }else if(diff.includes('Expert')) {
    return "EX"
  }else if(diff.includes("Hard")){
    return "H"
  }else if(diff.includes("Normal")){
    return "N"
  }
  return "E"
}