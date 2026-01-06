'use client';

import {InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}

            <input
                className={`input-base ${className}`}
                {...props}
            />
        </div>
    );
}
