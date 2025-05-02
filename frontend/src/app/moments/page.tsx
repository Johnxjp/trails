"use client";

import { Trail } from "@/lib/types";
import { getTrailData } from "@/app/moments/lib/getTrailData";

import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { formatLocalDate } from "@/lib/utils";

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
            <div className="max-w-7xl mx-auto mt-10">
                <h1 className="w-full text-3xl font-satoshi text-center font-semibold my-5 pb-5">Moments of Discovery</h1>
                <ul className="grid w-full grid-cols-3">
                    {trailHistory
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((trail: Trail, i: number) => {
                            return (<li key={i} onClick={() => router.push(`/moments/${trail.id}`)}>
                                <div key={i} className="hover:cursor-pointer flex flex-col rounded-lg p-1 mb-2">
                                    {/* TODO: Image Thumbnail needs changing */}
                                    <Image src={trail.narrative?.thumbnail_url || `/image_${12}.jpeg`} alt="narrative image" width={500} height={200} className="rounded-sm opacity-30 hover:opacity-100 mb-1" />
                                    <h2 className="text-lg line-clamp-1">{trail.name || "Untitled"}</h2>
                                    <p className="text-sm">{formatLocalDate(trail.created_at)}</p>
                                    {/* <p className="overflow-hidden line-clamp-4 flex-grow">{trail.summary || "A meandering and lovely trail through your notes"}</p> */}
                                </div>
                            </li>)
                        })
                    }
                </ul>
            </div>
        </div>
    );
}