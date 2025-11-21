'use client';

import {HTMLAttributes, ReactNode} from 'react';
import {card, cardHover} from "@/lib/simple-styles";


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
            className={`${hover ? cardHover : card} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
