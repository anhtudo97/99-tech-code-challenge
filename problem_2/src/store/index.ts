import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dataTokens } from "@/lib/constant";

type Token = typeof dataTokens[number];

type State = {
    fromToken: string;
    toToken: string;
    amount: number;
    address?: string;
    tokens: Token[];
    set: <K extends keyof State>(k: K, v: State[K]) => void;
    setTokens: (tokens: Token[]) => void;
};

export const useSwapStore = create<State>()(
    persist(
        (set) => ({
            fromToken: "",
            toToken: "",
            amount: 0,
            address: "",
            tokens: dataTokens,
            set: (k, v) => set((state) => ({ ...state, [k]: v })),
            setTokens: (tokens) => set({ tokens }),
        }),
        { name: "swap-store" }
    )
);
