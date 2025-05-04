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

export type NarrativeReferences = {
    id: string;  // id
    annotation_id: string; // annotation id
    text: string; // text in the narrative
}

export type Narrative = {
    id: string;
    title: string;
    content: string;
    references: NarrativeReferences[];
    thumbnail_url: string | null;
    date_created: string;
}

export type Trail = {
    id: string;
    name: string;
    nodes: Annotation[];
    created_at: string;
    narrative_id: string;
    narrative: Narrative | null;
}