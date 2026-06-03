<!-- components/ui/moderation/ModerationArticleCard.vue -->
<template>
    <div
        class="universal-card flex min-h-[6rem] flex-col justify-between gap-3 rounded-lg p-4 sm:h-24 sm:flex-row sm:items-center sm:gap-0"
        @click="router.push(`/moderation/news/article/${article.id}/edit`)"
    >
        <!-- Left: thumbnail + title/author/summary -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
            <div class="flex-shrink-0 overflow-hidden rounded-lg">
                <img
                    v-if="article?.thumbnail"
                    :src="article.thumbnail"
                    alt=""
                    class="h-12 w-12 rounded-md object-cover"
                />
                <div
                    v-else
                    class="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-800/40 text-xs opacity-60"
                >
                    IMG
                </div>
            </div>

            <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex items-start justify-between gap-2">
                    <h3 class="truncate text-lg font-semibold">
                        {{ article?.title || "(Untitled article)" }}
                    </h3>

                    <!-- Status chip: Archived > Draft > Scheduled > Published -->
                    <span
                        v-if="isArchived"
                        class="rounded-full bg-zinc-500/15 px-2 py-0.5 text-xs font-medium text-zinc-400"
                        >Archived</span
                    >
                    <span
                        v-else-if="isDraft"
                        class="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-500"
                        >Draft</span
                    >
                    <span
                        v-else-if="isScheduled"
                        class="bg-blue-500/15 text-blue-500 rounded-full px-2 py-0.5 text-xs font-medium"
                        >Scheduled</span
                    >
                    <span
                        v-else-if="isPublished"
                        class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500"
                        >Published</span
                    >
                </div>

                <div class="mt-0.5 flex items-center gap-2 text-xs opacity-75">
                    <span v-if="authorsText">By {{ authorsText }}</span>
                    <span v-if="authorsText && anyDate">·</span>
                    <span v-if="isScheduled && pubDate"
                        >Publishes {{ pubDate }}</span
                    >
                    <span v-else-if="isPublished && pubDate"
                        >Published {{ pubDate }}</span
                    >
                    <span v-else-if="updDate">Updated {{ updDate }}</span>
                </div>

                <p
                    v-if="article?.summary"
                    class="mt-1 line-clamp-2 text-sm opacity-80"
                >
                    {{ article.summary }}
                </p>
            </div>
        </div>

        <!-- Right: actions -->
        <div class="flex items-center justify-end gap-2 sm:justify-start">
            <ButtonStyled circular>
                <NuxtLink :to="`/news/${article?.slug ?? ''}`" target="_blank">
                    <EyeIcon class="size-4" />
                </NuxtLink>
            </ButtonStyled>

            <ButtonStyled
                circular
                color="orange"
                @click="emit('review', article!)"
            >
                <button>
                    <ScaleIcon class="size-4" />
                </button>
            </ButtonStyled>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

/** Align with your NewsType schema */
export interface NewsType {
    id: string;
    slug: string;
    title: string;
    summary: string;
    thumbnail: string;
    body: string;
    published: Date | string;
    updated: Date | string;
    authors: string[];
    draft?: boolean;
    archived?: boolean;
}

const props = defineProps<{ article: NewsType }>();
const emit = defineEmits<{ (e: "review", a: NewsType): void }>();

/** Helpers */
function ts(v?: Date | string | number): number {
    if (!v) return 0;
    const n = new Date(v as any).getTime();
    return Number.isFinite(n) ? n : 0;
}
const now = () => Date.now();

const isArchived = computed(() => props.article?.archived === true);
const isDraft = computed(
    () => props.article?.draft === true && !isArchived.value,
);
const isScheduled = computed(
    () =>
        !isDraft.value &&
        !isArchived.value &&
        ts(props.article?.published) > now(),
);
const isPublished = computed(
    () =>
        !isDraft.value &&
        !isArchived.value &&
        ts(props.article?.published) <= now(),
);

const pubDate = computed(() =>
    props.article?.published
        ? new Date(props.article.published).toLocaleString()
        : "",
);
const updDate = computed(() =>
    props.article?.updated
        ? new Date(props.article.updated).toLocaleString()
        : "",
);
const anyDate = computed(() => !!pubDate.value || !!updDate.value);

const authorsText = computed(() =>
    props.article?.authors?.length ? props.article.authors.join(", ") : "",
);
const router = useRouter();

/** Optional: expose a stable key if needed by parent lists */
// const stableKey = computed(() => props.article?.id ?? props.article?.slug)
</script>
