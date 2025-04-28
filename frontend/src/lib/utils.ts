export function formatLocalDate(utcDateString: string): string {
    // Create a date object from UTC string - JS automatically converts to local time
    const localDate = new Date(utcDateString);

    // Get the day of the week (in local time)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[localDate.getDay()];

    // Get the day of the month with ordinal suffix (in local time)
    const day = localDate.getDate();
    const ordinalSuffix = getOrdinalSuffix(day);

    // Get the month name (in local time)
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[localDate.getMonth()];

    // Get the time (in local time)
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');

    // Put it all together
    return `${dayName} ${day}${ordinalSuffix} ${monthName} ${hours}:${minutes}:${seconds}`;
}

function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function getTimeAgo(utcDateString: string): string {
    // Parse the input UTC string to a Date object
    const createdDate = new Date(utcDateString);
    const now = new Date();

    // Calculate the time difference in milliseconds
    const diffMs = now.getTime() - createdDate.getTime();

    // Convert to seconds
    const diffSeconds = Math.floor(diffMs / 1000);

    // Convert to appropriate units
    if (diffSeconds < 60) {
        return `Created ${diffSeconds} seconds ago`;
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `Created ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `Created ${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffSeconds / 86400);
        return `Created ${days} day${days !== 1 ? 's' : ''} ago`;
    }
}