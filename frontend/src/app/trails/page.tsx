"use client";

import { Trail } from "@/lib/types";
import { getTrailData } from "@/app/trails/lib/getTrailData";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function TrailHistoryPage() {
    const router = useRouter();
    const [trailHistory, setTrailHistory] = useState<Trail[]>([]);

    useEffect(() => {
        async function fetchTrailHistory() {
            const trailHistory = await getTrailData();
            if (!trailHistory) {
                console.error('Failed to fetch trail history');
                return;
            }
            setTrailHistory(trailHistory);
        }
        fetchTrailHistory();
    }, []);

    console.log('Trail history:', trailHistory);
    if (trailHistory.length === 0) {
        return <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col text-4xl text-slate-500 items-center justify-center">Go Explore!</div>;
    }

    return (
        <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col">
            <ul className="grid gap-4 max-w-2xl mx-auto w-full mt-30">
                {trailHistory.map((trail: Trail, i: number) => (
                    <li key={i} onClick={() => router.push(`/trails/${trail.id}`)}>
                        <div key={i} className="hover:text-white hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4">
                            <h2 className="text-2xl line-clamp-1 mb-2">{trail.name || "Untitled"}</h2>
                            <p>{trail.created_at}</p>
                            <p className="overflow-hidden line-clamp-4 flex-grow">{trail.summary || "A meandering and lovely trail through your notes"}</p>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    );
}