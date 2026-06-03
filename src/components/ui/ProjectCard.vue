<template>
    <article
        class="project-card w-full overflow-hidden rounded-2xl border border-solid border-surface-4 bg-surface-3 transition-all"
        :aria-label="name"
        role="listitem"
    >
        <!-- ── GRID MODE ── -->
        <div
            v-if="layout === 'grid' || layout === 'gallery'"
            class="flex h-full flex-col"
        >
            <!-- Banner -->
            <nuxt-link
                :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
                class="relative block overflow-hidden border-0 border-b border-solid border-surface-4"
                tabindex="-1"
                style="aspect-ratio: 2/1"
            >
                <img
                    v-if="featuredImage"
                    :src="featuredImage"
                    alt=""
                    class="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div
                    v-else
                    class="absolute inset-0"
                    :style="
                        color
                            ? `background: linear-gradient(to bottom right, ${toColor}, ${toColorDark});`
                            : 'background: var(--color-button-bg);'
                    "
                />
            </nuxt-link>

            <div class="flex grow flex-col gap-3 p-4">
                <div class="flex gap-3">
                    <nuxt-link
                        :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
                        tabindex="-1"
                        class="shrink-0"
                    >
                        <Avatar :src="iconUrl" size="96px" no-shadow />
                    </nuxt-link>
                    <div class="flex w-full flex-col gap-2">
                        <div class="grid grid-cols-[1fr_auto] gap-4">
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-2">
                                    <nuxt-link
                                        :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
                                        class="card-title-link"
                                    >
                                        <ProjectCardTitle
                                            :title="name"
                                            :compact="true"
                                        />
                                    </nuxt-link>
                                    <ProjectCardAuthor
                                        v-if="author"
                                        :author="author"
                                    />
                                    <Badge v-if="status" :type="status" />
                                </div>
                                <p
                                    class="m-0 line-clamp-2 text-sm font-normal"
                                    style="color: var(--color-secondary)"
                                >
                                    {{ description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-auto flex flex-col gap-2">
                    <Categories :categories="categories" :type="type">
                        <!-- <EnvironmentIndicator
                            :type-only="moderation"
                            :type="stall ? 'stall' : 'shop'"
                            :search="search"
                            :categories="categories"
                        /> -->
                    </Categories>
                    <div
                        class="flex flex-wrap items-center justify-between gap-2"
                        style="color: var(--color-secondary)"
                    >
                        <div class="flex items-center gap-3 text-sm">
                            <ProjectCardStats
                                :follows="follows"
                                :stall="stall"
                                :stall_color="stall_color"
                                :coordinates="coordinates"
                            />
                        </div>
                        <ProjectCardDate
                            v-if="showUpdatedDate && updatedAt"
                            :date="updatedAt"
                            type="updated"
                        />
                        <ProjectCardDate
                            v-else-if="showCreatedDate && createdAt"
                            :date="createdAt"
                            type="published"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- ── LIST MODE ── -->
        <div
            v-else
            class="grid-project-card-list grid gap-x-3 gap-y-2 p-4"
            :class="{ 'has-actions': !!$slots.default }"
        >
            <nuxt-link
                :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
                class="grid-project-card-list__icon flex items-center"
                tabindex="-1"
            >
                <Avatar :src="iconUrl" size="100px" no-shadow />
            </nuxt-link>

            <div class="grid-project-card-list__info flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <nuxt-link
                        :to="`/${$getProjectTypeForUrl(type, categories)}/${id}`"
                        class="card-title-link"
                    >
                        <ProjectCardTitle
                            :title="name"
                            :compact="layout === 'grid'"
                        />
                    </nuxt-link>

                    <ProjectCardAuthor v-if="author" :author="author" />
                    <Badge v-if="status" :type="status" />
                </div>
                <p
                    class="m-0 line-clamp-2 text-sm"
                    style="color: var(--color-secondary)"
                >
                    {{ description }}
                </p>
            </div>

            <div
                class="grid-project-card-list__stats ml-auto flex shrink-0 flex-col items-end gap-3 empty:hidden"
                :class="{ 'mt-3': !!$slots.default }"
            >
                <div class="flex items-center gap-3">
                    <ProjectCardStats
                        :follows="follows"
                        :stall="stall"
                        :stall_color="stall_color"
                        :coordinates="coordinates"
                    />
                </div>
                <ProjectCardDate
                    v-if="showUpdatedDate && updatedAt"
                    :date="updatedAt"
                    type="updated"
                />
                <ProjectCardDate
                    v-else-if="showCreatedDate && createdAt"
                    :date="createdAt"
                    type="published"
                />
            </div>

            <div
                class="grid-project-card-list__tags mt-auto flex items-center gap-3"
            >
                <Categories :categories="categories" :type="type">
                    <!-- <EnvironmentIndicator
                        :type-only="moderation"
                        :type="stall ? 'stall' : 'shop'"
                        :search="search"
                        :categories="categories"
                    /> -->
                </Categories>
            </div>

            <div
                v-if="$slots.default"
                class="grid-project-card-list__actions ml-auto flex shrink-0 gap-1"
            >
                <slot />
            </div>
        </div>
    </article>
</template>

<script>
import Categories from "~/components/ui/search/Categories.vue";
import Badge from "~/components/ui/Badge.vue";
import EnvironmentIndicator from "~/components/ui/EnvironmentIndicator.vue";
import Avatar from "~/components/ui/Avatar.vue";
import ProjectCardAuthor from "~/components/modrinth/ui/project/ProjectCardAuthor.vue";
import ProjectCardStats from "~/components/modrinth/ui/project/ProjectCardStats.vue";
import ProjectCardDate from "~/components/modrinth/ui/project/ProjectCardDate.vue";
import ProjectCardTitle from "~/components/modrinth/ui/project/ProjectCardTitle.vue";

export default {
    components: {
        EnvironmentIndicator,
        Avatar,
        Categories,
        Badge,
        ProjectCardTitle,
        ProjectCardAuthor,
        ProjectCardStats,
        ProjectCardDate,
    },
    props: {
        id: {
            type: String,
            default: "vanillatyme-0",
        },
        layout: {
            type: String,
            default: "list", // 'list' | 'grid'
        },
        stall: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "shop",
        },
        name: {
            type: String,
            default: "Project Name",
        },
        author: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: "",
        },
        iconUrl: {
            type: String,
            default: null,
            required: false,
        },
        follows: {
            type: String,
            default: null,
            required: false,
        },
        createdAt: {
            type: String,
            default: null,
        },
        updatedAt: {
            type: String,
            default: null,
        },
        categories: {
            type: Array,
            default() {
                return [];
            },
        },
        status: {
            type: String,
            default: null,
        },
        moderation: {
            type: Boolean,
            required: false,
            default: false,
        },
        search: {
            type: Boolean,
            required: false,
            default: false,
        },
        featuredImage: {
            type: String,
            required: false,
            default: null,
        },
        showUpdatedDate: {
            type: Boolean,
            required: false,
            default: true,
        },
        showCreatedDate: {
            type: Boolean,
            required: false,
            default: true,
        },
        color: {
            type: Number,
            required: false,
            default: null,
        },
        stall_color: {
            type: String,
            required: false,
            default: null,
        },
        coordinates: {
            type: Object,
            required: false,
            default: null,
        },
    },
    setup() {
        const tags = useTags();
        return { tags };
    },
    computed: {
        toColor() {
            if (!this.color) return null;
            const color = this.color >>> 0;
            const b = color & 0xff;
            const g = (color & 0xff00) >>> 8;
            const r = (color & 0xff0000) >>> 16;
            return `rgba(${r},${g},${b},1)`;
        },
        toColorDark() {
            if (!this.color) return null;
            const color = this.color >>> 0;
            const b = color & 0xff;
            const g = (color & 0xff00) >>> 8;
            const r = (color & 0xff0000) >>> 16;
            return `rgba(${Math.round(r * 0.5)},${Math.round(g * 0.5)},${Math.round(b * 0.5)},1)`;
        },
    },
};
</script>

<style scoped>
.no-outline {
    outline: none;
}

:deep(.project-card-container) {
    container-type: inline-size;
}

.grid-project-card-list {
    grid-template:
        "icon info stats stats"
        "icon info stats stats"
        "icon tags tags tags";
    grid-template-columns: auto 1fr auto auto;
}

.grid-project-card-list.has-actions {
    grid-template:
        "icon info actions actions"
        "icon info dummy stats"
        "icon tags tags stats";
    grid-template-columns: auto 1fr auto auto;
}

.grid-project-card-list__icon {
    grid-area: icon;
}
.grid-project-card-list__info {
    grid-area: info;
}
.grid-project-card-list__actions {
    grid-area: actions;
}
.grid-project-card-list__stats {
    grid-area: stats;
}
.grid-project-card-list__tags {
    grid-area: tags;
}

@container (width < 850px) {
    .project-card__icon {
        --_override-size: 64px;
    }

    .grid-project-card-list {
        grid-template:
            "icon info stats"
            "icon info stats"
            "tags tags tags";
        grid-template-columns: auto 1fr auto;
    }

    .grid-project-card-list.has-actions {
        grid-template:
            "icon info actions"
            "icon info stats"
            "tags tags stats";
        grid-template-columns: auto 1fr auto;
    }
}

@container (width < 550px) {
    .project-card__icon {
        --_override-size: 64px;
    }

    .grid-project-card-list {
        grid-template:
            "icon info"
            "icon info"
            "tags tags"
            "stats stats";
        grid-template-columns: auto 1fr;
    }

    .grid-project-card-list.has-actions {
        grid-template:
            "icon info"
            "icon info"
            "tags tags"
            "stats stats"
            "actions actions";
        grid-template-columns: auto 1fr;
    }

    .grid-project-card-list__stats,
    .grid-project-card-list__actions {
        @apply w-full items-start;
    }

    .grid-project-card-list__info {
        @apply gap-0.5;
    }

    .project-card-summary {
        @apply text-sm;
    }
}

.bg-project-gradient {
    --_gradient-start: var(--_project-color, #000);
    --_gradient-end: var(--_project-color, #000);
    @supports (
        background-color: oklch(from var(--_project-color, #000) l c h)
    ) {
        --_gradient-start: oklch(
            from var(--_project-color, #000) calc(l * 0.8) calc(c * 0.8)
                calc(h + 15)
        );
        --_gradient-end: oklch(
            from var(--_project-color, #000) calc(l * 0.5) calc(c * 0.9) h
        );
    }
    background-color: var(--_gradient-start);
    background-image: linear-gradient(
        to bottom right,
        var(--_gradient-start),
        var(--_gradient-end)
    );
}

.placeholder-banner {
    opacity: 0.7;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
