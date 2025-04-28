'use client';

import { Annotation } from "@/lib/types";
import { useEffect, useState } from "react";

export function DataPanel({ seedId, panelIndex, updateTrailNodes }: { seedId: string | null, panelIndex: number, updateTrailNodes: (annotationId: string, panelIndex: number) => void }) {

    const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
    const [displayedAnnotations, setDisplayedAnnotations] = useState<Annotation[]>([]);

    function handleAnnotationClick(annotationId: string) {
        setSelectedAnnotationId(annotationId);
        updateTrailNodes(annotationId, panelIndex);
    }

    useEffect(() => {
        // Fetch the data for the given seedId. Use async/await
        // to handle the asynchronous nature of the fetch call.
        async function fetchRelatedAnnotations(annotationId: string) {
            try {
                const response = await fetch(`http://localhost:8000/annotations/${annotationId}/related`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data: { annotations: Annotation[] } = await response.json();
                setDisplayedAnnotations(data.annotations);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        async function fetchRandomAnnotations() {
            try {
                const response = await fetch(`http://localhost:8000/annotations/`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data: { annotations: Annotation[] } = await response.json();
                setDisplayedAnnotations(data.annotations);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        if (seedId !== null) {
            fetchRelatedAnnotations(seedId);
        } else {
            fetchRandomAnnotations();
        }


    }, [seedId]);

    function renderSelectedAnnotation(annotation: Annotation) {
        return (
            <div
                className={`space-y-5 text-white min-h-48 hover:cursor-pointer flex flex-col bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4 ${selectedAnnotationId === annotation.id ? 'bg-carmine-red/80' : ''}`}>
                <h2 className="text-lg font-bold line-clamp-2 mb-2">{annotation.title || "Untitled"}</h2>
                <p className="flex-grow">{annotation.content}</p>
            </div>
        );
    }

    function renderUnselectedAnnotation(annotation: Annotation) {
        return (
            <div
                className={`space-y-5 hover:text-white min-h-48 h-48 hover:h-auto hover:cursor-pointer flex flex-col bg-sulphur-yellow/50 hover:bg-carmine-red/80 transition-colors duration-200 shadow-md rounded-lg p-4 ${selectedAnnotationId === annotation.id ? 'bg-carmine-red/80' : ''}`}>
                <h2 className="text-lg font-bold line-clamp-2 mb-2">{annotation.title || "Untitled"}</h2>
                <p className="overflow-hidden line-clamp-4 hover:line-clamp-none flex-grow">{annotation.content}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-w-lg max-w-lg py-5 px-5 shadow-lg h-full">
            {seedId === null ? <h1 className="font-bold text-lg ">Your Journey Begins</h1> : <h1 className="font-bold text-lg ">Related Annotations</h1>}
            <ul className="grid w-full md:grid-cols-1 gap-3 mt-5 overflow-y-auto h-full scrollbar-thin">
                {displayedAnnotations.map((annotation, i) => (
                    <li className="flex-1" key={i} onClick={() => handleAnnotationClick(annotation.id)}>
                        {(selectedAnnotationId && annotation.id == selectedAnnotationId) ? (
                            renderSelectedAnnotation(annotation)
                        ) : (
                            renderUnselectedAnnotation(annotation)
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}