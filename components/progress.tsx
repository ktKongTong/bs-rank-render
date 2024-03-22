"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { twMerge } from "tailwind-merge";

export default function Progress(
{
    value,
    className,
    containerClassName
}:{
    value: number,
    className?: string,
    containerClassName?: string
}
) {
    return (
        <>
        <ProgressPrimitive.Root className={twMerge("relative overflow-hidden rounded-full min-w-24 max-w-48 h-2 bg-gray-100", containerClassName)} value={value}>
            <ProgressPrimitive.Indicator
                className={twMerge(" h-2 rounded-full bg-gradient-to-r from-red-500 to-blue-500", className)}
                style={{transform: `translateX(-${100 - value}%)` }}
            />
        </ProgressPrimitive.Root>
        </>
    )
}