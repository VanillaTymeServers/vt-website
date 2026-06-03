import { computed } from "vue";

export function useRelativeTime() {
    const formatter = computed(
        () =>
            new Intl.RelativeTimeFormat("en", {
                numeric: "auto",
                style: "long",
            }),
    );

    return (value: string | number | Date) => {
        const now = Date.now();
        const time = new Date(value).getTime();
        const diffInSeconds = Math.round((time - now) / 1000);

        const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] =
            [
                { unit: "year", seconds: 31536000 },
                { unit: "month", seconds: 2592000 },
                { unit: "week", seconds: 604800 },
                { unit: "day", seconds: 86400 },
                { unit: "hour", seconds: 3600 },
                { unit: "minute", seconds: 60 },
                { unit: "second", seconds: 1 },
            ];

        for (const { unit, seconds } of units) {
            const diff = Math.round(diffInSeconds / seconds);
            if (Math.abs(diff) >= 1) {
                return formatter.value.format(diff, unit);
            }
        }

        return "just now";
    };
}
