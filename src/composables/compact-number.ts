import { computed } from "vue";

export function useCompactNumber() {
    const formatterRef = computed(
        () => new Intl.NumberFormat("en", { notation: "compact" }),
    );

    return (value: number, options?: Intl.NumberFormatOptions) =>
        formatterRef.value.format(value);
}
