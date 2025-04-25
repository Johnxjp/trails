import { Annotation } from "@/lib/types";

export function Trail({ trailNodes }: { trailNodes: Annotation[] }) {
    return (
        <div className="flex flex-col mx-auto p-1 md:px-2">
            <ul className="grid gap-y-3">
                {trailNodes.map((d, i) => (
                    // if odd index add a cdot before the item
                    <li className="flex-1" key={i}>
                        <div
                            className="space-y-5 hover:text-white h-48 hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-bold line-clamp-2 mb-2">{d.title || "Untitled"}</h2>
                            <p className="overflow-hidden line-clamp-4 flex-grow">{d.content}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}