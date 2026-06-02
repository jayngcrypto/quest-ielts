import { type ClassValue, clsx as clsxBase } from "clsx";
export function cn(...inputs: ClassValue[]) {
  return clsxBase(inputs);
}
