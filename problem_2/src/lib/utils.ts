import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Swap amount of tokenA to tokenB using price and BUSD as the intermediary.
 * @param amountA The amount of tokenA to swap
 * @param priceA The price of tokenA (in BUSD)
 * @param priceB The price of tokenB (in BUSD)
 * @returns The amount of tokenB received
 */
export function swapAmount(amountA: number, priceA: number, priceB: number): number {
  if (priceB === 0) return 0;
  return (amountA * priceA) / priceB;
}