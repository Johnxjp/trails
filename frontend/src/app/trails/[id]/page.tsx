import { Trail } from "@/lib/types";

import Image from "next/image";
import Markdown from "react-markdown";

import { getTrailDataById } from "../lib/getTrailData";
import { formatLocalDate } from "@/lib/utils";
import { AnnotationPanel } from "./AnnotationPanel";

export default async function TrailItemPage({ params }: {
    params: Promise<{ id: string }>
}) {
    // Gets the trail ID from the URL
    const { id } = await params;
    console.log('Trail ID:', id);
    const trail: Trail | null = await getTrailDataById(id);
    console.log('Trail data:', trail);

    if (!trail) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Oops. You`&apos`re lost down the rabbit hole</h1>
            </div>
        );
    }

    return (
        <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col items-center">
            <div className="max-w-5xl">
                <div className="flex flex-col justify-left w-full px-4 my-4">
                    <h1 className="font-semibold text-2xl text-black">{trail.narrative?.title || trail.name || "Untitled"}</h1>
                    <p>{formatLocalDate(trail.created_at)}</p>
                </div>
                <div className="flex flex-row w-full items-top px-4 gap-10">
                    <div className="flex flex-col min-w-4/6 max-w-4/6 space-y-2">
                        <Image src="/narrative_image.png" alt="narrative image" width={650} height={200} className="rounded-lg shadow-md mb-5" />
                        <Markdown>{trail.narrative?.content}</Markdown>
                        {/* <p className="flex-grow">{trail.summary || "A meandering and lovely trail through your notes"}</p> */}
                    </div>
                    <AnnotationPanel annotations={trail.nodes} />
                </div>
            </div>
        </div>
    );
}