'use client'

import { Annotation } from "@/lib/types";

import { useState } from "react";

export function AnnotationPanel({ annotations }: { annotations: Annotation[] }) {
    const [showAnnotations, setShowAnnotations] = useState(false);
    return (
        <div className="flex flex-col mx-auto p-1 md:px-2 w-2/6 m-2 space-y-2">
            <button onClick={() => setShowAnnotations(!showAnnotations)} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            {
                showAnnotations ? (
                    <ul className="grid gap-y-3">
                        {annotations.map((d, i) => (
                            <li className="flex-1" key={i}>
                                <div
                                    className="space-y-5 hover:text-white hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4">
                                    <h2 className="text-lg font-bold line-clamp-2 mb-2">{d.title || "Untitled"}</h2>
                                    <p>{d.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : null
            }
        </div>
    )
}