import { Annotation } from "@/lib/types";


function DataCard({ data }: { data: Annotation }) {
    return (
        <div className="flex flex-col bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold">{data.title}</h2>
            <p className="text-gray-700">{data.content}</p>
        </div>
    );
}


export function DataGrid({ data }: { data: Annotation[] }) {
    return (
        <div className="mx-auto max-w-4xl w-full px-1 md:px-2 flex">
            <ul className="grid w-full md:grid-cols-3 gap-3">
                {data.map((d, i) => (
                    <li className="flex-1" key={i}>
                        <DataCard data={d} />
                    </li>
                ))}
            </ul>
        </div>
    );
}