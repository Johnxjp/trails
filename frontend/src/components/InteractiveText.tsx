'use client'

import { JSX } from "react";

import { NarrativeReferences } from "@/lib/types";

export default function InteractiveText({ text, references, onAnnotationClick }: { text: string; references: NarrativeReferences[], onAnnotationClick: (annotationId: string) => void }) {

    function renderText(text: string, references: NarrativeReferences[]) {

        const indexes = references.map((reference) => {
            const startIndex = text.indexOf(reference.text);
            return {
                start: startIndex,
                end: startIndex + reference.text.length,
                id: reference.annotation_id,
            }
        })
        const sortedIndexes = indexes.sort((a, b) => a.start - b.start);
        const textElements: (string | JSX.Element)[] = [];
        let currentIndex = 0;
        sortedIndexes.forEach((index, i) => {
            const start = index.start;
            const end = index.end;
            const id = index.id;

            const spanText = text.slice(currentIndex, start);
            if (spanText) {
                // Split the text into paragraphs
                // and add them to the textElements array
                const breaks = spanText.split(/\n\n/)
                breaks.forEach((t, i) => {
                    textElements.push(t)
                    if (i !== breaks.length - 1) {
                        textElements.push(<><br/><br/></>)
                    }
                })
            };
            currentIndex = end;

            // Add the highlighted text
            textElements.push(
                <span className="text-carmine-red/60 hover:text-carmine-red/100 underline cursor-pointer transition-opacity duration 200 ease-in" key={`annotation-${id}`} onClick={() => onAnnotationClick(id)}>
                    {text.slice(start, end)}
                </span>
            );

            if (i === sortedIndexes.length - 1) {
                const remainingText = text.slice(end);
                if (remainingText) {
                    textElements.push(remainingText);
                }
            }
        })
        return <p>{textElements}</p>;

    }


    return (
        <div className="inline">
            {renderText(text, references)}
            {/* <Markdown>7454</Markdown><span>456</span><Markdown>7454</Markdown> */}
        </div>
    );
}