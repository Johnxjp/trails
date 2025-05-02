import { Trail } from "@/lib/types";

import { getTrailDataById } from "../lib/getTrailData";
import Content from "./Content";

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
            <Content data={trail} />
        </div>
    );
}