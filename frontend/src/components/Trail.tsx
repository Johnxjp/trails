'use client'
import { useState } from "react";
import { Annotation } from "@/lib/types";

function ActionButtons({ itemId, breakTrail, deleteItem }:
    { itemId: string, breakTrail: (id: string) => void, deleteItem: (id: string) => void }) {
    return (
        <div className="flex flex-row items-center justify-center space-x-2">
            <button className="inset-shadow-sm inset-shadow-slate-400/50 
            rounded-full font-bold bg-neutral-grey/80 
            hover:cursor-pointer hover:bg-carmine-red
            p-1" title="Break trail" onClick={() => breakTrail(itemId)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9" />
                </svg>

            </button>
            <button className="inset-shadow-sm inset-shadow-slate-400/50 
            rounded-full font-bold bg-neutral-grey/80 
            hover:cursor-pointer hover:bg-carmine-red
            p-1" title="Delete this item" onClick={() => deleteItem(itemId)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>

            </button >
        </div >
    );
}

export function Trail({ trailNodes, breakTrail, deleteItem }:
    { trailNodes: Annotation[], breakTrail: (id: string) => void, deleteItem: (id: string) => void }) {
    const [clickedId, setClickedId] = useState<string | null>(null);

    return (
        <div className="flex flex-col mx-auto p-1 md:px-2">
            <ul className="grid gap-y-3">
                {trailNodes.map((d, i) => (
                    // if odd index add a cdot before the item
                    <div key={`container-${i}`} className="flex flex-col gap-y-3" onClick={() => {
                        if (clickedId == d.id) {
                            setClickedId(null);
                        } else {
                            setClickedId(d.id);
                        }
                    }}>
                        <li className="flex-1" key={i}>
                            <div
                                className="space-y-5 hover:text-white h-48 hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4">
                                <h2 className="text-lg font-bold line-clamp-2 mb-2">{d.title || "Untitled"}</h2>
                                <p className="overflow-hidden line-clamp-4 flex-grow">{d.content}</p>
                            </div>
                        </li>
                        {
                            (clickedId == d.id) ? <ActionButtons itemId={d.id} breakTrail={breakTrail} deleteItem={deleteItem} /> : null
                        }

                    </div>

                ))
                }
            </ul >
        </div >
    );
}