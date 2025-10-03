export function formatTime(minutes: number): string {
    const formattedMinutes = +minutes?.toFixed(0) || 0;

    if (formattedMinutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(formattedMinutes / 60);
        const remainingMinutes = formattedMinutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
}

const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function convertToBanglaNumber(number: number): string {
    return number.toString().split('').map(d => banglaDigits[parseInt(d)] || d).join('');
}

export function formatDate(dateString: string, locale: string = 'en'): string {
    const date = new Date(dateString);
    const day = date.getDate();
    
    const monthNames = {
        en: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        bn: [
            "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
            "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
        ]
    };
    
    const month = monthNames[locale][date.getMonth()];
    const year = date.getFullYear().toString();
    
    if (locale === 'bn') {
        const banglaDay = convertToBanglaNumber(day);
        const banglaYear = convertToBanglaNumber(parseInt(year));
        return `${banglaDay} ${month}, ${banglaYear}`;
    }
    
    return `${day} ${month}, ${year}`;
}

export function getImageTypeFromBase64(base64String: string): string {
    if (base64String.startsWith("/9j/")) return "jpg";
    if (base64String.startsWith("iVBORw0KGgo")) return "png";
    return "jpg";
};