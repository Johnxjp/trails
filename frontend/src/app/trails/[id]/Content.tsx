'use client';

import { useState } from "react";
import Image from "next/image";

import { Nodes, Trail } from "@/lib/types";
import { formatLocalDate } from "@/lib/utils";
// import { AnnotationPanel } from "./AnnotationPanel";
import InteractiveText from "@/components/InteractiveText";

export default function Content({ data }: { data: Trail }) {

    const [clickedAnnotation, setClickedAnnotation] = useState<Nodes | null>(null);
    console.log('Nodes:', data.nodes);

    function handleAnnotationClick(annotationId: string) {
        console.log("Clicked annotation:", annotationId);
        data.nodes.forEach((annotation) => {
            if (annotation.id === annotationId) {
                setClickedAnnotation(annotation);
            }
        })
    }

    return (
        <div className="max-w-5xl py-5">
            <div className="flex flex-col justify-left w-full px-4 my-4">
                <h1 className="font-semibold text-2xl text-black">{data.narrative?.title || data.name || "Untitled"}</h1>
                <p>{formatLocalDate(data.created_at)}</p>
            </div>
            <div className="flex flex-row w-full items-top px-4 gap-5">
                <div className="flex flex-col min-w-4/6 max-w-4/6 space-y-2">
                    <Image src={data.narrative?.thumbnail_url || "/image_12.jpeg"} alt="narrative image" width={650} height={200} className="rounded-lg shadow-md mb-5" />
                    <InteractiveText text={data.narrative?.content || ""} references={data.narrative?.references || []} onAnnotationClick={handleAnnotationClick} />
                </div>
                {
                    (clickedAnnotation !== null) && (
                        <div className="flex flex-col mx-auto p-1 md:px-2 w-2/6 m-2 space">
                            <div className="w-80 space-y-5 flex flex-col bg-neutral-grey/50 transition-colors duration-200 shadow-md rounded-lg p-4">
                                <h2 className="text-lg font-bold line-clamp-2 mb-2">{clickedAnnotation.title || "Untitled"}</h2>
                                <p>{clickedAnnotation.content}</p>
                            </div>
                        </div>
                    )
                }
                {/* <AnnotationPanel annotations={data.nodes} /> */}
            </div>
        </div >
    );
}