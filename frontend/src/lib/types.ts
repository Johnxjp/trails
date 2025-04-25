export type Annotation = {
    id: string;
    title: string;
    authors: string | null;
    content: string;
    annotation_type: "comment" | "highlight" | "bookmark";
    location_type: string | null;
    location_start: number | null;
    location_end: number | null;
    date_annotated: string | null;
}

export type Trail = {
    id: string;
    name: string;
    nodes: Annotation[];
    created_at: string;
    summary: string;
    thumbnail: string;
}