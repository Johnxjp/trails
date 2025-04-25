// import { getTrailDataById } from "../lib/getTrailData";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

import { Trail } from "@/lib/types";
import { getTrailDataById } from "../lib/getTrailData";


export default async function TrailItemPage({ params }: {
    params: Promise<{ id: string }>
}) {
    // Gets the trail ID from the URL
    const { id } = await params;
    console.log('Trail ID:', id);
    const trail: Trail = await getTrailDataById(id);
    console.log('Trail data:', trail);

    return (
        <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col items-center">
            <div className="flex flex-row max-w-4xl w-full items-top p-4">
                <div className="flex flex-col w-2/5 space-y-2 m-2">
                    <h1 className="font-medium text-2xl text-slate-500">{trail.name || "Untitled"}</h1>
                    <p>{trail.created_at}</p>
                    <p className="flex-grow">{trail.summary || "A meandering and lovely trail through your notes"}</p>
                </div>
                <div className="flex flex-col mx-auto p-1 md:px-2 w-3/5 m-2">
                    <ul className="grid gap-y-3">
                        {trail.nodes.map((d, i) => (
                            <li className="flex-1" key={i}>
                                <div
                                    className="space-y-5 hover:text-white hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4">
                                    <h2 className="text-lg font-bold line-clamp-2 mb-2">{d.title || "Untitled"}</h2>
                                    <p>{d.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}