import { Narrative } from "@/lib/types";

import { getMomentById, getAnnotationById } from "@/lib/fetchData";
import Content from "./Content";

export default async function TrailItemPage({ params }: {
    params: Promise<{ id: string }>
}) {
    // Gets the trail ID from the URL
    const { id } = await params;
    console.log('Trail ID:', id);
    const narrative: Narrative | null = await getMomentById(id);
    console.log('Narrative data:', narrative);

    // Get all unique annotation IDs referenced in the narrative
    const annotation_ids = narrative?.references.map((reference) => reference.annotation_id);
    console.log('Annotation IDs:', annotation_ids);
    // Get all unique annotation IDs referenced in the narrative
    const uniqueAnnotationIds = Array.from(new Set(annotation_ids));
    console.log('Unique Annotation IDs:', uniqueAnnotationIds);
    // Get all annotations referenced in the narrative
    const referenced_annotations = await Promise.all(
        uniqueAnnotationIds.map(async (annotationId) => {
            const annotation = await getAnnotationById(annotationId);
            return annotation;
        })
    )
    const filtered_referenced_annotations = referenced_annotations.filter((annotation) => annotation !== null);

    if (!narrative) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Oops. You`&apos`re lost down the rabbit hole</h1>
            </div>
        );
    }

    return (
        <div className="mx-auto w-screen h-screen px-1 md:px-2 flex flex-col items-center">
            <Content narrative={narrative} referenced_annotations={filtered_referenced_annotations} />
        </div>
    );
}