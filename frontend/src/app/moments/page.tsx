"use client";

import { Narrative } from "@/lib/types";
import { getMoments } from "@/lib/fetchData";

import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { formatLocalDate } from "@/lib/utils";

export default function MomentsPage() {
    const router = useRouter();
    const [trailHistory, setTrailHistory] = useState<Narrative[]>([]);

    useEffect(() => {
        async function getMomentsData() {
            const trailHistory = await getMoments();
            if (!trailHistory) {
                console.error('Failed to fetch trail history');
                return;
            }
            setTrailHistory(trailHistory);
        }
        getMomentsData();
    }, []);

    console.log('Trail history:', trailHistory);
    if (trailHistory.length === 0) {
        return <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col text-4xl text-slate-500 items-center justify-center">Go Explore!</div>;
    }

    return (
        <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col">
            <div className="max-w-7xl mx-auto mt-10">
                <h1 className="w-full text-lg font-satoshi font-semibold my-2 p-1">Past Explorations</h1>
                <ul className="grid w-full grid-cols-3">
                    {trailHistory
                        .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
                        .map((narrative: Narrative, i: number) => {
                            const imageIndex = Math.floor(Math.random() * 11) + 1;
                            return (<li key={i} onClick={() => router.push(`/moments/${narrative.id}`)}>
                                <div key={i} className="hover:cursor-pointer flex flex-col rounded-lg p-1 mb-2">
                                    {/* TODO: Image Thumbnail needs changing */}
                                    <Image src={narrative.thumbnail_url || `/image_${imageIndex}.jpeg`} alt="narrative image" width={500} height={200} className="rounded-sm grayscale hover:grayscale-0 mb-1" />
                                    <h2 className="text-lg line-clamp-1">{narrative.title || "Untitled"}</h2>
                                    <p className="text-sm">{formatLocalDate(narrative.date_created)}</p>
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