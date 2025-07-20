import { NumberInput } from "@/components/molecules/AmountInput";
import { TokenSelect } from "@/components/molecules/TokenSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSwapStore } from "@/store";
import { cn, swapAmount } from "@/lib/utils";
import { swapSchema, type SwapFormValues } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

const validateAmount = (value?: number, balance?: number) => {
    if (!value) return false;
    if (value > (balance ?? 0)) {
        return `Insufficient balance (max: ${balance ?? 0})`;
    }
    return true;
};

export function SwapTokenBox() {
    const {
        control,
        setValue,
        watch
    } = useForm<SwapFormValues>({
        resolver: zodResolver(swapSchema),
        mode: "onChange",
        defaultValues: {
            fromToken: "eth",
            toToken: "busd",
            address: "",
            amount: 0,
        }
    });

    const fromToken = watch("fromToken");
    const fromAmount = watch("amount");
    const toToken = watch("toToken");

    // Get tokens from zustand store
    const tokens = useSwapStore(state => state.tokens);
    // Memoize infoFromToken and infoToToken
    const infoFromToken = useMemo(() => tokens.find(token => token.value === fromToken), [fromToken, tokens]);
    const infoToToken = useMemo(() => tokens.find(token => token.value === toToken), [toToken, tokens]);

    // Memoize receivedAmount and rateOneToOne
    const receivedAmount = useMemo(() => {
        if (!fromAmount || !infoFromToken?.price || !infoToToken?.price) return 0;
        return swapAmount(fromAmount, infoFromToken.price, infoToToken.price);
    }, [fromAmount, infoFromToken?.price, infoToToken?.price]);

    const rateOneToOne = useMemo(() => {
        if (!infoFromToken?.price || !infoToToken?.price) return 0;
        return swapAmount(1, infoFromToken.price, infoToToken.price);
    }, [infoFromToken?.price, infoToToken?.price]);

    const set = useSwapStore(state => state.set);
    const setTokens = useSwapStore(state => state.setTokens);

    // Handle swap tokens and update their balances
    const handleSwap = () => {
        if (!infoFromToken || !infoToToken || !fromAmount || fromAmount <= 0) return;
        // Prevent swap if amount exceeds fromToken balance
        if (fromAmount > infoFromToken.balance) {
            alert("Cannot swap more than your balance.");
            return;
        }
        // Calculate received amount
        const received = swapAmount(fromAmount, infoFromToken.price, infoToToken.price);
        // Update balance for each token
        const newTokens = tokens.map(token => {
            if (token.value === infoFromToken.value) {
                return { ...token, balance: token.balance - fromAmount };
            }
            if (token.value === infoToToken.value) {
                return { ...token, balance: token.balance + received };
            }
            return token;
        });
        setTokens(newTokens);
        // Swap fromToken and toToken
        set("fromToken", infoToToken.value);
        set("toToken", infoFromToken.value);
        set("amount", 0);
    };

    // set amount = balance 
    const handleSetMaxAmount = () => {
        if (infoFromToken?.balance) setValue("amount", infoFromToken.balance);
    };

    // Flag: amount > balance
    const isAmountOverBalance = useMemo(() => {
        return infoFromToken?.balance && fromAmount && fromAmount > infoFromToken.balance;
    }, [infoFromToken, fromAmount]);

    return (
        <div className="w-[500px] rounded-2xl bg-[#292c35] border-none shadow-lg p-0 pt-0 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="text-white/80 font-medium text-base">Swap</span>
                <button className="text-[#6a6e84] p-2 rounded-full hover:bg-[#232536]/40">
                    <svg height={18} width={18} viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#6a6e84" strokeWidth="2" />
                        <path d="M10 6V10L12 12" stroke="#6a6e84" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="relative flex flex-col gap-2">
                {/* Token From */}
                <div className="rounded-xl bg-[#232536] px-5 py-4 mx-4 mt-1 flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                        <TokenSelect name="fromToken" control={control} />
                        <Controller
                            name="amount"
                            control={control}
                            rules={{
                                validate: value => {
                                    return validateAmount(value, infoFromToken?.balance ?? 0);
                                },
                                max: {
                                    value: infoFromToken?.balance ?? 0,
                                    message: `Amount must be below than ${infoFromToken?.balance}`
                                }
                            }}
                            render={({ field }) => {
                                return (
                                    <div className="w-full flex flex-col gap-1 items-end">
                                        <NumberInput
                                            {...field}
                                            defaultValue={field.value}
                                            onValueChange={v => field.onChange(Number(v))}
                                            className={cn(isAmountOverBalance && "text-red-500")}
                                            placeholder="0"
                                        />
                                    </div>
                                );
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-0">
                        <span className="text-[#87a1bf]">
                            Balance: <span className={cn(isAmountOverBalance ? "text-red-500" : "text-white/90")}>{infoFromToken?.balance.toFixed(4)} ${infoFromToken?.symbol}</span>
                            <button
                                type="button"
                                className="text-[#5472b0] ml-2 cursor-pointer"
                                onClick={handleSetMaxAmount}
                            >
                                (Max)
                            </button>
                        </span>
                        <span className="text-[#a3aac2]">≈  ${infoFromToken?.price.toFixed(4)}</span>
                    </div>
                </div>

                {/* Divider Swap Icon */}
                <div className="flex items-center justify-center my-1 absolute z-10 top-[52%] -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <div className="bg-[#232536] border-[4px] border-[#292c35] rounded-full size-11 flex items-center justify-center -mt-3 shadow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.4498 6.71997L6.72974 3L3.00977 6.71997" stroke="#717A8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.72949 21L6.72949 3" stroke="#717A8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13.5498 17.28L17.2698 21L20.9898 17.28" stroke="#717A8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M17.2695 3V21" stroke="#717A8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                </div>

                {/* Token To */}
                <div className="rounded-xl bg-[#232536] px-5 py-4 mx-4 flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                        <TokenSelect name="toToken" control={control} />
                        <Input
                            type="number"
                            inputMode="decimal"
                            className="bg-transparent border-none text-right text-[1.5rem] font-bold placeholder:text-[#60667c] text-white shadow-none p-0 w-[120px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative"
                            placeholder="0"
                            value={receivedAmount.toFixed()}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-0">
                        <span className="text-[#87a1bf]">
                            Balance: <span className="text-white/90">{infoToToken?.balance.toFixed(4)} {infoToToken?.symbol}</span>
                        </span>
                        <span className="text-[#a3aac2]">≈ ${infoToToken?.price}</span>
                    </div>
                </div>
            </div>

            {/* Exchange Rate */}
            <div className="flex justify-end pr-8 pt-2">
                <span className="text-[11px] text-[#86838d]">1 {fromToken?.toUpperCase()} = {rateOneToOne.toFixed(4)} {toToken?.toUpperCase()}</span>
            </div>

            {/* Swap Button */}
            <div className="px-4 mt-5">
                <Button
                    className="w-full h-12 rounded-xl bg-[#dac266] hover:bg-[#ebdb92] text-[#38352f] font-semibold text-lg"
                    onClick={handleSwap}
                    disabled={!!isAmountOverBalance}
                >
                    {isAmountOverBalance ? "Insufficient balance" : "Swap"}
                </Button>
            </div>
        </div>
    );
}
