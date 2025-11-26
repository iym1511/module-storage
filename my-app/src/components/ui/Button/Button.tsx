'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import {
    btnOutline,
    btnPrimary,
    btnSecondary,
} from '@/lib/simple-styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: ReactNode;
}

export function Button({
                           variant = 'primary',
                           children,
                           className = '',
                           ...props
                       }: ButtonProps) {
    const variants = {
        primary: btnPrimary,
        secondary: btnSecondary,
        outline: btnOutline,
    };

    return (
        <button
            {...props}
            className={`${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}