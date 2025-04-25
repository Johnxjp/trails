export function getTrailData() {
    return fetch('http://localhost:8000/trail', {
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
            console.error('Error fetching trail data:', error);
            return []; // Handle error case
        });
}

export function getTrailDataById(id: string) {
    return fetch(`http://localhost:8000/trail/${id}`, {
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
            console.error('Error fetching trail data:', error);
            return null; // Handle error case
        });
}