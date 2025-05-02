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
    id: string;  // annotation id referenced in the narrative
    text: string; // text in the narrative
}

export type Narrative = {
    id: string;
    title: string;
    content: string;
    references: NarrativeReferences[];
    thumbnail_url: string | null;
}

export type Nodes = {
    id: string;
    title: string;
    authors: string | null;
    content: string;
}

export type Trail = {
    id: string;
    name: string;
    nodes: Nodes[];
    created_at: string;
    narrative_id: string;
    narrative: Narrative | null;
}