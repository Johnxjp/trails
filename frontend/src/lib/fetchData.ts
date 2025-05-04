import { Annotation, Narrative } from '@/lib/types';

export function getMoments(): Promise<Narrative[]> {
    return fetch('http://localhost:8000/narratives', {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data check
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error fetching narratives:', error);
            return []; // Handle error case
        });
}

export function getMomentById(id: string): Promise<Narrative | null> {
    return fetch(`http://localhost:8000/narratives/${id}`, {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data check
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: Narrative) => {
            console.log('Narrative:', data);
            return data;
        })
        .catch((error) => {
            console.error('Error fetching narrative data:', error);
            return null; // Handle error case
        });
}

export function getAnnotationById(id: string): Promise<Annotation | null> {
    return fetch(`http://localhost:8000/annotations/${id}`, {
        method: 'GET',
        cache: 'no-store', // Ensure fresh data check
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: Annotation) => {
            console.log('Annotation:', data);
            return data;
        })
        .catch((error) => {
            console.error('Error fetching trail data:', error);
            return null; // Handle error case
        });
}
