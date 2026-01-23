'use client';

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

export default function PriceFilter() {
    const [price, setPrice] = useState<[number, number]>([10000, 50000]);

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-between text-sm">
                <span>{price[0].toLocaleString()}원</span>
                <span>{price[1].toLocaleString()}원</span>
            </div>

            <Slider
                value={price}
                onValueChange={(value) => setPrice(value as [number, number])}
                min={0}
                max={100000}
                step={1000}
            />
        </div>
    );
}
