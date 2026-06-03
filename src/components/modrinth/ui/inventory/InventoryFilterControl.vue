<template>
    <div class="experimental-styles-within flex flex-col gap-3">
        <div class="iconified-input w-full">
            <IconSearch aria-hidden="true" class="text-lg" />
            <input
                type="text"
                autocomplete="off"
                spellcheck="false"
                placeholder="Search items..."
                v-model="searchQuery"
                @input="updateFilters"
            />
            <Button
                v-if="searchQuery"
                class="r-btn"
                @click="
                    () => {
                        searchQuery = '';
                        updateFilters();
                    }
                "
            >
                <IconX />
            </Button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <ManySelect
                v-model="selectedStatus"
                :options="filterOptions.status"
                :dropdown-id="`${baseId}-status`"
                @change="updateFilters"
            >
                <IconFilter class="h-5 w-5 text-secondary" />
                Status
                <template #option="{ option }">
                    {{
                        option === "active"
                            ? "Active"
                            : option === "draft"
                              ? "Draft"
                              : option === "archived"
                                ? "Archived"
                                : option === "unlisted"
                                  ? "Unlisted"
                                  : option
                    }}
                </template>
            </ManySelect>
            <ManySelect
                v-model="selectedAvailability"
                :options="filterOptions.availability"
                :dropdown-id="`${baseId}-availability`"
                @change="updateFilters"
            >
                <IconFilter class="h-5 w-5 text-secondary" />
                Availability
                <template #option="{ option }">
                    {{
                        option === "in_stock"
                            ? "In stock"
                            : option === "out_of_stock"
                              ? "Out of stock"
                              : option === "limited_stock"
                                ? "Limited stock"
                                : option === "restocked"
                                  ? "Restocked"
                                  : option
                    }}
                </template>
            </ManySelect>
        </div>
        <div class="flex flex-wrap items-center gap-1 empty:hidden">
            <TagItem
                v-if="selectedStatus.length + selectedAvailability.length > 1"
                class="transition-transform active:scale-[0.95]"
                :action="clearFilters"
            >
                <IconCircleX />
                Clear all filters
            </TagItem>
            <TagItem
                v-for="status in selectedStatus"
                :key="`remove-filter-${status}`"
                :style="`--_color: var(--color-${status === 'out_of_stock' ? 'red' : status === 'beta' ? 'orange' : 'green'});--_bg-color: var(--color-${status === 'alpha' ? 'red' : status === 'beta' ? 'orange' : 'green'}-highlight)`"
                :action="() => toggleFilter('status', status)"
            >
                <IconX />
                {{ status.slice(0, 1).toUpperCase() + status.slice(1) }}
            </TagItem>
            <TagItem
                v-for="availability in selectedAvailability"
                :key="`remove-filter-${availability}`"
                :style="`--_color: var(--color-platform-${availability})`"
                :action="() => toggleFilter('availability', availability)"
            >
                <IconX />
                {{
                    availability === "in_stock"
                        ? "In stock"
                        : availability === "out_of_stock"
                          ? "Out of stock"
                          : availability === "limited_stock"
                            ? "Limited stock"
                            : availability === "restocked"
                              ? "Restocked"
                              : availability
                }}
            </TagItem>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconFilter, IconCircleX, IconX, IconSearch } from "@tabler/icons-vue";
import ManySelect from "../base/ManySelect.vue";
import TagItem from "../base/TagItem.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Button from "../base/Button.vue";

const props = defineProps<{
    inventory: any[];
    baseId?: string;
}>();

const emit = defineEmits(["update:query"]);

const allStatuses = ref(["draft", "published", "archived", "unlisted"]);
const allAvailabilities = ref([
    "in_stock",
    "out_of_stock",
    "limited_stock",
    "restocked",
]);

const route = useRoute();

type FilterType = "status" | "availability";
type Filter = string;

const filterOptions = computed(() => {
    const filters: Record<FilterType, Filter[]> = {
        status: [],
        availability: [],
    };
    const statusSet = new Set();
    const availabilitySet = new Set();

    for (const item of props.inventory) {
        statusSet.add(item.status);
        availabilitySet.add(item.availability);
    }

    if (statusSet.size > 0) {
        filters.status = Array.from(statusSet) as Filter[];
        filters.status.sort(
            (a, b) =>
                allStatuses.value.indexOf(a) - allStatuses.value.indexOf(b),
        );
    }
    if (availabilitySet.size > 0) {
        filters.availability = Array.from(availabilitySet) as Filter[];
        filters.availability.sort(
            (a, b) =>
                allAvailabilities.value.indexOf(a) -
                allAvailabilities.value.indexOf(b),
        );
    }

    return filters;
});

const selectedStatus = ref<string[]>([]);
const selectedAvailability = ref<string[]>([]);
const searchQuery = ref<string>("");

selectedStatus.value = route.query.s ? getArrayOrString(route.query.s) : [];
selectedAvailability.value = route.query.a
    ? getArrayOrString(route.query.a)
    : [];
searchQuery.value = typeof route.query.q === "string" ? route.query.q : "";

async function toggleFilters(type: FilterType, filters: Filter[]) {
    for (const filter of filters) {
        await toggleFilter(type, filter, true);
    }

    updateFilters();
}

async function toggleFilter(type: FilterType, filter: Filter, bulk = false) {
    if (type === "status") {
        selectedStatus.value = selectedStatus.value.includes(filter)
            ? selectedStatus.value.filter((x) => x !== filter)
            : [...selectedStatus.value, filter];
    } else if (type === "availability") {
        selectedAvailability.value = selectedAvailability.value.includes(filter)
            ? selectedAvailability.value.filter((x) => x !== filter)
            : [...selectedAvailability.value, filter];
    }
    if (!bulk) {
        updateFilters();
    }
}

async function clearFilters() {
    selectedStatus.value = [];
    selectedAvailability.value = [];

    updateFilters();
}

function updateFilters() {
    emit("update:query", {
        s: selectedStatus.value,
        a: selectedAvailability.value,
        q: searchQuery.value,
        page: undefined,
    });
}

defineExpose({
    toggleFilter,
    toggleFilters,
    selectedStatus,
    selectedAvailability,
    searchQuery,
});

function getArrayOrString(x: string | string[]): string[] {
    if (typeof x === "string") {
        return [x];
    } else {
        return x;
    }
}
</script>

<style lang="scss" scoped>
.iconified-input {
    flex: 1;

    input {
        width: 100%;
        margin: 0;
    }
}
</style>
