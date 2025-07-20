
import { forwardRef, useEffect, useState } from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export interface NumberInputProps
    extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
    // stepper?: number;
    thousandSeparator?: string;
    placeholder?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    value?: number; // Controlled value
    suffix?: string;
    prefix?: string;
    onValueChange?: (value: number | undefined) => void;
    fixedDecimalScale?: boolean;
    decimalScale?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            // stepper,
            thousandSeparator,
            placeholder,
            defaultValue,
            min = -Infinity,
            max = Infinity,
            onValueChange,
            fixedDecimalScale = false,
            decimalScale = 4,
            suffix,
            prefix,
            // value,
            ...props
        },
        ref
    ) => {
        const [value, setValue] = useState<number | undefined>(defaultValue);

        useEffect(() => {
            setValue(defaultValue);
        }, [defaultValue]);

        const handleValue = (newValue?: number) => {
            // Nếu input là chuỗi chỉ chứa dấu chấm, set undefined
            if (typeof newValue === 'string') {
                if ((newValue as string).trim() === '.') {
                    setValue(undefined);
                    if (onValueChange) onValueChange(undefined);
                    return;
                }
            }
            let v = newValue;
            if (typeof v !== 'number' || isNaN(v)) {
                setValue(undefined);
                if (onValueChange) onValueChange(undefined);
                return;
            }
            if (v < min) v = min;
            if (v > max) v = max;
            setValue(v);
            if (onValueChange) onValueChange(v);
        };

        return (
            <NumericFormat
                {...props}
                value={value}
                onValueChange={(values) => handleValue(values.floatValue)}
                thousandSeparator={thousandSeparator}
                decimalScale={decimalScale}
                fixedDecimalScale={fixedDecimalScale}
                allowNegative={min < 0}
                valueIsNumericString={false}
                max={max}
                min={min}
                suffix={suffix}
                prefix={prefix}
                customInput={Input}
                placeholder={placeholder}
                className={
                    cn(
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative bg-transparent border-none outline-none text-right text-[1.5rem] font-bold placeholder:text-[#60667c] text-white p-0 w-[120px] rounded-none",
                        props.className
                    )
                }
                getInputRef={ref}
                isAllowed={(values) => /^\d*\.?\d*$/.test(values.value)}

            />
        );
    }
);
