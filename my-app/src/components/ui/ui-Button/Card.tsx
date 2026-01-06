'use client';

import {HTMLAttributes, ReactNode} from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    children: ReactNode;
}

export function Card({
                         hover = false,
                         children,
                         className = '',
                         ...props
                     }: CardProps) {
    return (
        <div
            className={`${hover ? 'card-hover' : 'card'} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}