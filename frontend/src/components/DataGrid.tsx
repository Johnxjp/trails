import { Annotation } from "@/lib/types";


export function DataCard({ data, addToTrailNodes }: { data: Annotation, addToTrailNodes: (annotation: Annotation) => void }) {
    return (
        <div
            onClick={() => addToTrailNodes(data)}
            className="space-y-5 hover:text-white h-48 hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold line-clamp-2 mb-2">{data.title || "Untitled"}</h2>
            <p className="overflow-hidden line-clamp-4 flex-grow">{data.content}</p>
        </div>
    );
}


export function DataGrid({ data, addToTrailNodes }: { data: Annotation[], addToTrailNodes: (annotation: Annotation) => void }) {
    return (
        <div className="mx-auto max-w-6xl w-full px-1 md:px-2 flex">
            <ul className="grid w-full md:grid-cols-3 gap-3">
                {data.map((d, i) => (
                    <li className="flex-1" key={i}>
                        <DataCard data={d} addToTrailNodes={addToTrailNodes} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
