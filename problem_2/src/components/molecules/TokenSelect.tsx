import * as React from "react";
import { Controller, type Control } from "react-hook-form";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import type { SwapFormValues } from "@/types/schemas";
import { cn } from "@/lib/utils";
import { useSwapStore } from "@/store";

interface TokenSelectProps {
    name: keyof SwapFormValues;
    control: Control<SwapFormValues>;
    disabled?: boolean;
}

const TokenSelectComponent: React.FC<TokenSelectProps> = ({
    name,
    control,
    disabled,
}) => {
    // get tokens từ zustand store
    const tokens = useSwapStore(state => state.tokens);
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const selected = tokens.find(token => String(token.value) === String(field.value));
                return (
                    <Select
                        value={field.value !== undefined ? String(field.value) : undefined}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            className={cn(
                                "w-full h-14 rounded-xl bg outline-none transition px-0 flex items-center gap-3 group"
                            )}
                        >
                            {selected ? (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg focus:outline-none cursor-pointer transition-colors bg-[#242736] hover:bg-[#31344a]">
                                    <img
                                        src={selected.icon}
                                        alt={selected.label}
                                        className="w-6 h-6 transition-all duration-200 rounded-full"
                                        draggable={false}
                                        style={{ background: "#302f38" }}
                                    />
                                    <span className="font-semibold text-base text-white">{selected.label}</span>
                                    <svg
                                        width={18}
                                        height={18}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        className="ml-1 opacity-70"
                                    >
                                        <path
                                            d="M6 8L10 12L14 8"
                                            stroke="#BCC2D7"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="text-[#7c8ea5] text-base">Chọn token</span>
                                </div>
                            )}
                        </SelectTrigger>
                        <SelectContent className="bg-[#232536] border-0 rounded-xl py-1 px-0 shadow-xl z-40">
                            {tokens.map(token => (
                                <SelectItem
                                    key={token.value}
                                    value={String(token.value)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition hover:bg-[#32466f]/60 aria-selected:bg-[#32466f]"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={token.icon}
                                            alt={token.label}
                                            className="size-8 rounded-[999999]  transition-all duration-200"
                                            draggable={false}
                                        />
                                        <div className="text-white text-sm font-semibold">{token.label}</div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }}
        />
    );
};

export const TokenSelect = React.memo(TokenSelectComponent);
