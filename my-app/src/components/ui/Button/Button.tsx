'use client';

import {ButtonHTMLAttributes, ReactNode} from 'react';

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
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
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