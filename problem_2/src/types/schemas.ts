// src/schema/swapSchema.ts
import { z } from "zod";

export const swapSchema = z.object({
    fromToken: z.string().optional(),
    toToken: z.string().optional(),
    amount: z.coerce.number().optional(),
    address: z.string().optional(),
});
export type SwapFormValues = z.infer<typeof swapSchema>;
