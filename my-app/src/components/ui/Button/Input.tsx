'use client';

import { InputHTMLAttributes } from 'react';
import {input, inputLabel} from "@/lib/simple-styles";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className={`${inputLabel}`}>
                    {label}
                </label>
            )}

            <input
                className={`${input} ${className}`}
                {...props}
            />
        </div>
    );
}
