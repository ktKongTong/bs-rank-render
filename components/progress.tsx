"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress";

export default function Progress({value}:{value: any}) {
    return (
        <>
        <ProgressPrimitive.Root className="relative overflow-hidden rounded-full min-w-24 max-w-48 h-2 bg-gray-100" value={value}>
            <ProgressPrimitive.Indicator
            className=" h-2 rounded-full bg-gradient-to-r from-red-500 to-blue-500"
            style={{transform: `translateX(-${100 - value}%)` }}
            />
        </ProgressPrimitive.Root>
        </>
    )
}