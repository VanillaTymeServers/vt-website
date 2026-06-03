<template>
    <div>
        Editing article: {{ route.params.id }}
        <div class="flex items-center gap-3 pt-4">
            <button @click="router.push({ path: '/moderation/news' })" v-tooltip="'Exit'"><IconArrowUpLeft/></button>
            <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <span class="font-medium">{{ statusLabel }}</span>
                <span>|</span>
                <span class="flex items-center gap-1">
                    <span>{{ syncLabel }}</span>
                    <span
                        class="inline-block h-2 w-2 rounded-full"
                        :class="syncDotClass"
                    />
                </span>
            </div>
        </div>
        <div class="flex gap-3 pt-4">
            <span v-if="editor" v-tooltip="characterCount + ' characters'">
                {{ wordCount }} words
            </span>
            <button type="button" @click="onCancel">Cancel</button>

            <button type="button" :disabled="!canUndo" @click="onUndo">
                Undo
            </button>
            <button type="button" :disabled="!canRedo" @click="onRedo">
                Redo
            </button>

            <button type="button" :disabled="saving" @click="onSave">
                {{ saving ? "Saving…" : "Save" }}
            </button>
            <button type="button" @click="changeTheme">
                {{ theme.active === "light" ? "Dark" : "Light" }}
            </button>
        </div>
        <div class="mb-4 md:mb-10 layout-content">
            <div class="relative mt-5 md:mt-12">
                <div class="relative mx-auto mt-6 max-w-[40rem]">
                    <div class="relative">
                        <div class="absolute top-0 left-0 w-full h-full -ml-10 z-0"></div>
                        <div class="flex flex-wrap lg:flex-nowrap mb-5 -ml-8 min-w-[calc(100%+2rem)] relative rounded-lg">
                            <div>
                                <div>
                                    <button type="button" class="flex items-center gap-x-2 min-w-[140px] flex-nowrap mb-3 md:mb-0 ml-6 px-2 py-[.4rem] text-sm text-gray-400 hover:text-black transition-colors hover:bg-gray-100 rounded-lg">
                                        <span><Image /></span>
                                        <span class="font-medium">Add thumbnail</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="relative flex">
                            <textarea class="h-[3rem] w-full editor-title-textarea placeholder-gray-300 focus:border-transparent focus:ring-0 box-0 p-0 m-0 border-0 outline-0 focus:outline-none focus:border-none active:outline-none active:border-none font-semibold text-4xl resize-none bg-transparent" name="post-title" placeholder="Add a title" style="overflow: hidden; overflow-wrap: break-word; text-align: start; height: 48px; box-shadow: unset;" v-model="title"></textarea>
                        </div>
                    </div>
                    <div class="relative flex">
                        <div class="relative w-full">
                            <textarea class="h-8 editor-subtitle-textarea placeholder-gray-300 focus:border-transparent focus:ring-0 box-0 p-0 m-0 border-0 outline-0 focus:outline-none focus:border-none active:outline-none active:border-none mt-1 text-gray-600 resize-none w-full bg-transparent" name="post-subtitle" placeholder="Add a subtitle" style="overflow: hidden; overflow-wrap: break-word; text-align: start; height: 32px; box-shadow: unset;"></textarea>
                        </div>
                    </div>
                    <div class="mt-6">
                        <div class="relative flex">
                            <div class="absolute top-0 left-0 w-full h-full -ml-10 z-0"></div>
                            <div class="relative flex">
                                <ul class="flex w-full list-none m-0 p-0">
                                    <li v-for="author in authors" class="cursor-pointer" :key="author.id">
                                        <div class="flex items-center justify-center overflow-hidden text-ellipsis border border-1 px-4 py-2 rounded-2xl text-xs font-medium mr-2 text-brand border-brand-blue bg-brand-highlight">
                                            <div>
                                                <div>
                                                    <div >{{ author.username }}</div>
                                                </div>
                                            </div>
                                            <div class="-mr-2" aria-label="remove">
                                                <X/>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="relative mt-1">
                                <div>
                                    <div><button type="button" class="items-center rounded-lg inline-flex font-medium leading-[1.2] text-left " style="background: 0px center; border: 0px; text-decoration: none; color: rgb(39, 42, 47); font-size: 0.875rem; padding: 0.3125rem; ">
                                        <div class="flex flex-row">
                                            <span class="mx-0 inline-block h-4 w-4"><Plus/></span>
                                        </div>
                                    </button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mx-auto max-w-4xl space-y-4 px-4 py-8" v-if="loaded">
            <TipTapEditor v-model="body" ref="editorRef" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import TipTapEditor from "~/components/ui/moderation/TipTapEditor.vue";
import { IconSun, IconMoon, IconArrowUpLeft } from "@tabler/icons-vue";
import { useDebounceFn } from "@vueuse/core";
import { Cross, Image, Plus, X } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const theme = useTheme();
const changeTheme = theme.cycle;
const dirty = ref(false);
const draft = ref(true);
const published = ref<Date | null>(null);

definePageMeta({
    layout: "empty",
    middleware: "auth",
});
if (!route.params.id) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "The page could not be found.",
    });
}

const articleId = route.params.id as string;
const title = ref("");
const subtitle = ref("");
const body = ref("");
const saving = ref(false);
const authors = ref<Array<{ id: string; username: string; avatar_url: string; uuid: string }>>([]);
const slug = ref("");
const loaded = ref(false);
const { data, error, pending } = await useLazyAsyncData(
    `article-${articleId}`,
    () =>
        useBaseFetch(`moderation/news/article/${articleId}`, {
            method: "GET",
        }),
);

if (error.value) {
    throw createError({
        fatal: true,
        statusCode: error.value.statusCode || 500,
        statusMessage:
            error.value.statusMessage ||
            "An error occurred while fetching the article.",
    });
}
if (data.value) {
    const article = data.value as any;
    title.value = article.title || "";
    body.value = article.body || "";
    subtitle.value = article.subtitle || "";
    slug.value = article.slug || "";
    authors.value = article.authors || [];
    draft.value = article.draft ?? true;
    published.value = article.published ? new Date(article.published) : null;
    loaded.value = true;
}
const statusLabel = computed(() => {
    if (draft.value) return "Draft";
    if (!published.value) return "Draft"; // safety

    const now = new Date();
    const pub = new Date(published.value);

    if (pub > now) return "Scheduled";
    return "Published";
});

const syncState = ref<"synced" | "syncing" | "error">("synced");

const syncLabel = computed(() => {
    if (syncState.value === "syncing") return "Syncing";
    if (syncState.value === "error") return "Error syncing";
    return "Synced";
});
const syncDotClass = computed(() => {
    if (syncState.value === "syncing") return "bg-yellow-400";
    if (syncState.value === "error") return "bg-red-500";
    return "bg-emerald-500";
});

const autoSave = useDebounceFn(async () => {
    if (!dirty.value) return;
    syncState.value = "syncing";
    try {
        await onSave();
        syncState.value = "synced";
        dirty.value = false;
    } catch (e) {
        syncState.value = "error";
        throw e;
    }
}, 1000); // save 1s after last change

const onSave = async () => {
    saving.value = true;
    syncState.value = "syncing";
    try {
        await useBaseFetch(`moderation/news/article/${articleId}`, {
            method: "PATCH",
            body: {
                title: title.value,
                subtitle: subtitle.value,
                body: body.value,
                slug: slug.value,
                draft: draft.value,
                published: published.value,
            },
        });
        syncState.value = "synced";
    } catch (e) {
        console.error("Error saving article:", e);
        syncState.value = "error";
    } finally {
        saving.value = false;
    }
};
const onCancel = () => {
    router.push(`/moderation/news`);
};
watch(
    data,
    (val) => {
        if (!val || loaded.value) return;
        const article = val as any;
        title.value = article.title || "";
        body.value = article.body || "";
        subtitle.value = article.subtitle || "";
        slug.value = article.slug || "";
        draft.value = article.draft ?? true;
        published.value = article.published
            ? new Date(article.published)
            : null;
        loaded.value = true;
    },
    { immediate: false },
);
watch(
    [title, subtitle, body, slug],
    () => {
        dirty.value = true;
        autoSave();
    },
    { deep: false },
);
const editorRef = ref<InstanceType<typeof TipTapEditor> | null>(null);

const editor = computed(() => editorRef.value?.editor);

const wordCount = computed(() => editorRef.value?.wordCount ?? 0);

const characterCount = computed(() => editorRef.value?.characterCount ?? 0);

const canUndo = computed(() => !!editor.value?.can().undo());
const canRedo = computed(() => !!editor.value?.can().redo());

const onUndo = () => {
    editor.value?.chain().focus().undo().run();
};
const onRedo = () => {
    editor.value?.chain().focus().redo().run();
};
</script>

<style></style>
