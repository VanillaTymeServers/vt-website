<template>
    <ModerationShell>
        <ModerationNewArticleModal ref="modalNewArticle" />
        <div class="flex flex-col gap-3">
            <div class="flex flex-col justify-between gap-3 lg:flex-row">
                <div class="iconified-input flex-1 lg:max-w-md">
                    <IconSearch aria-hidden="true" class="text-lg" />
                    <input
                        v-model="query"
                        class="h-[40px]"
                        autocomplete="off"
                        spellcheck="false"
                        type="text"
                        placeholder="Search..."
                        @input="goToPage(1)"
                    />
                    <Button
                        v-if="query"
                        class="r-btn"
                        @click="() => (query = '')"
                    >
                        <IconX />
                    </Button>
                </div>

                <div
                    class="flex flex-col justify-end gap-2 sm:flex-row lg:flex-shrink-0"
                >
                    <div class="flex flex-col gap-2 sm:flex-row">
                        <DropdownSelect
                            v-slot="{ selected }"
                            v-model="currentFilterType"
                            class="!w-full flex-grow sm:!w-[280px] sm:flex-grow-0 lg:!w-[280px]"
                            name="Filter By"
                            :options="filterTypes as unknown as unknown[]"
                            @change="goToPage(1)"
                        >
                            <span
                                class="flex flex-row gap-2 align-middle font-semibold text-secondary"
                            >
                                <IconFilter class="size-4 flex-shrink-0" />
                                <span class="truncate">{{ selected }}</span>
                            </span>
                        </DropdownSelect>

                        <DropdownSelect
                            v-slot="{ selected }"
                            v-model="currentSortType"
                            class="!w-full flex-grow sm:!w-[150px] sm:flex-grow-0 lg:!w-[150px]"
                            name="Sort by"
                            :options="[...sortTypes]"
                            @change="goToPage(1)"
                        >
                            <span
                                class="flex flex-row gap-2 align-middle font-semibold text-secondary"
                            >
                                <IconSortAscending
                                    v-if="selected === 'Oldest'"
                                    class="size-4 flex-shrink-0"
                                />
                                <IconSortDescending
                                    v-else
                                    class="size-4 flex-shrink-0"
                                />
                                <span class="truncate">{{ selected }}</span>
                            </span>
                        </DropdownSelect>
                    </div>

                    <ButtonStyled color="purple" class="w-full sm:w-auto">
                        <button
                            class="flex !h-[40px] w-full items-center justify-center gap-2 sm:w-auto"
                            @click="modalNewArticle?.show($event)"
                        >
                            <IconWriting class="size-4 flex-shrink-0" />
                            <span class="hidden sm:inline">Start writing</span>
                            <span class="sm:hidden">New Article</span>
                        </button>
                    </ButtonStyled>
                </div>
            </div>

            <div v-if="totalPages > 1" class="flex justify-center lg:hidden">
                <!-- <Pagination
                :page="currentPage"
                :count="totalPages"
                @switch-page="goToPage"
            /> -->
            </div>

            <div class="mt-4 flex flex-col gap-2">
                <div
                    v-if="paginatedArticles.length === 0"
                    class="universal-card h-24 animate-pulse"
                ></div>
                <ModerationArticleCard
                    v-for="article in paginatedArticles"
                    :key="article.id"
                    :article="article"
                />
            </div>
        </div>
    </ModerationShell>
</template>

<script lang="ts" setup>
import {
    IconFilter,
    IconPlus,
    IconSearch,
    IconSortAscending,
    IconSortDescending,
    IconWriting,
    IconX,
} from "@tabler/icons-vue";
import ModerationShell from "~/components/ui/moderation/ModerationShell.vue";
import Button from "~/components/modrinth/ui/base/Button.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import DropdownSelect from "~/components/modrinth/ui/base/DropdownSelect.vue";
import ModerationArticleCard from "~/components/ui/moderation/ModerationArticleCard.vue";
import type { NewsType } from "~/server/models/news";
import Fuse from "fuse.js";
import ModerationNewArticleModal from "~/components/ui/moderation/ModerationNewArticleModal.vue";
const route = useRoute();
const router = useRouter();

const modalNewArticle = ref<InstanceType<
    typeof ModerationNewArticleModal
> | null>(null);
/** Fetch all articles (paged endpoint, same logic you had but simplified and kept intact structurally) */
const { data: allArticles } = await useLazyAsyncData(
    "new-moderation-articles",
    async () => {
        const startTime = performance.now();
        let currentOffset = 0;
        const ARTICLE_ENDPOINT_COUNT = 350;
        const acc: NewsType[] = [];

        while (true) {
            const batch = (await useBaseFetch(
                `moderation/news/articles?count=${ARTICLE_ENDPOINT_COUNT}&offset=${currentOffset}`,
            )) as NewsType[];

            if (!batch?.length) break;

            acc.push(...batch);
            currentOffset += batch.length;
            if (batch.length < ARTICLE_ENDPOINT_COUNT) break;
        }

        const duration = performance.now() - startTime;
        console.debug(
            `Articles fetched in ${duration.toFixed(2)}ms (${(duration / 1000).toFixed(2)}s)`,
        );
        return acc;
    },
);
const query = ref(route.query.q?.toString() || "");

/** Keep q in the URL (unchanged behavior) */
watch(
    query,
    (newQuery) => {
        const currentQuery = { ...route.query };
        if (newQuery) currentQuery.q = newQuery;
        else delete currentQuery.q;

        router.replace({ path: route.path, query: currentQuery });
    },
    { immediate: false },
);

watch(
    () => route.query.q,
    (qParam) => {
        const newValue = qParam?.toString() || "";
        if (query.value !== newValue) query.value = newValue;
    },
);

/** Sort + filter choices (kept) */
const currentSortType = ref<"Newest" | "Oldest">("Newest");
const sortTypes = readonly(["Newest", "Oldest"] as const);
type FilterKey = "All" | "Draft" | "Published" | "Scheduled" | "Archived";

const currentFilterType = ref<FilterKey>("All");
const filterTypes = readonly([
    "All",
    "Draft",
    "Published",
    "Scheduled",
    "Archived",
] as const);

/** Pagination */
const currentPage = ref(1);
const itemsPerPage = 15;

function ts(v: Date | string | number | null | undefined): number {
    if (!v) return 0;
    const n = new Date(v as any).getTime();
    return Number.isFinite(n) ? n : 0;
}

const fuse = computed(() => {
    if (!allArticles.value?.length) return null;
    return new Fuse(allArticles.value, {
        keys: [
            { name: "id", weight: 3 },
            { name: "title", weight: 2.5 },
            { name: "summary", weight: 2 },
            "body",
            "slug",
            "authors",
        ],
        includeScore: true,
        threshold: 0.4,
    });
});

const searchResults = computed(() => {
    if (!query.value || !fuse.value) return null;
    return fuse.value.search(query.value).map((r) => r.item);
});

const baseFiltered = computed(() => {
    if (!allArticles.value) return [];
    return query.value && searchResults.value
        ? searchResults.value
        : [...allArticles.value];
});

function isDraft(a: NewsType) {
    return a.draft === true;
}
function isArchived(a: NewsType) {
    return a.archived === true;
}
function isScheduled(a: NewsType) {
    return a.draft === false && !isArchived(a) && ts(a.published) > Date.now();
}
function isPublished(a: NewsType) {
    return a.draft === false && !isArchived(a) && ts(a.published) <= Date.now();
}

const typeFiltered = computed(() => {
    switch (currentFilterType.value) {
        case "Draft":
            return baseFiltered.value.filter(isDraft);
        case "Archived":
            return baseFiltered.value.filter(isArchived);
        case "Published":
            return baseFiltered.value.filter(isPublished);
        case "Scheduled":
            return baseFiltered.value.filter(isScheduled);
        default:
            return baseFiltered.value;
    }
});

function dateKey(a: NewsType): number {
    return ts(a.published) || ts(a.updated);
}

const filteredArticles = computed(() => {
    const out = [...typeFiltered.value];
    if (currentSortType.value === "Oldest")
        out.sort((a, b) => dateKey(a) - dateKey(b));
    else out.sort((a, b) => dateKey(b) - dateKey(a));
    return out;
});

const totalPages = computed(() =>
    Math.ceil((filteredArticles.value?.length || 0) / itemsPerPage),
);

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredArticles.value.slice(start, start + itemsPerPage);
});

function goToPage(page: number) {
    currentPage.value = page;
}
</script>

<style></style>
