<template>
    <div class="mb-3 flex flex-wrap gap-2">
        <Pagination
            :page="currentPage"
            class="ml-auto mt-auto"
            :count="Math.ceil(inventory.length / pageSize)"
            @switch-page="switchPage"
        />
    </div>
    <div
        v-if="inventory.length > 0"
        class="inventory-list display-mode--grid"
    >
        <template v-for="(item, index) in inventory" :key="index">
            <article class="inventory-card base-card padding-bg" :class="{ 'popular': item.popular}">
                <nuxt-link
                    :title="item.product.item.label"
                    class="icon"
                    tabindex="-1"
                    :to="inventoryLink ? inventoryLink(item) : undefined"
                >
                    <Avatar
                        :src="`data:image/png;base64,${item.product.item.icon}`"
                        :alt="item.product.item.label"
                        size="md"
                        no-shadow
                        loading="lazy"
                    />
                </nuxt-link>
                <div class="title">
                    <nuxt-link :to="inventoryLink ? inventoryLink(item) : undefined">
                        <h2 class="name !text-2xl">
                            {{
                                item.product.custom_name ||
                                item.product.item.label
                            }}
                        </h2>
                    </nuxt-link>
                    <p
                        v-if="item.product.custom_name"
                        class="item-original-name"
                    >
                        {{ item.product.item.label }}
                    </p>
                </div>
                <p class="description">
                    {{ item.note }}
                </p>
                <div class="flex-warp flex gap-1 tags">
                    <TagItem
                        v-if="item.popular"
                        style="color: var(--color-green)"
                    >
                        <IconStar aria-hidden="true" />
                        Popular
                    </TagItem>
                    <TagItem
                        v-if="item.sale?.enabled"
                        style="color: var(--color-red)"
                    >
                        <IconRosetteDiscount aria-hidden="true" />
                        Sale
                    </TagItem>
                </div>
                <div class="stats">
                    <div class="stat">
                        <template v-if="item.sale?.enabled">
                            <strong style="color: var(--color-red)">
                                {{ item.sale.amount }}
                            </strong>
                            <sub
                                ><strike>{{ item.price.amount }}</strike>
                            </sub>
                        </template>
                        <template v-else>
                            <strong>{{ item.price.amount }}</strong>
                        </template>

                        <img
                            :src="`data:image/png;base64,${item.price.currency.icon}`"
                            :alt="item.price.currency.label"
                            width="30-rem"
                        />
                        <strong>for {{ item.product.amount }}</strong>
                    </div>
                    <div class="stat date" v-tooltip="$dayjs(item.updated).format('MMMM D, YYYY [at] h:mm A')">
                        <IconRefresh aria-hidden="true" />
                        <span class="date-label">Updated </span>{{ fromNow(item.updated) }}
                    </div>
                </div>
            </article>
        </template>
    </div>
    <div class="mt-3 flex">
        <Pagination
            :page="currentPage"
            class="ml-auto"
            :count="Math.ceil(inventory.length / pageSize)"
            @switch-page="switchPage"
        />
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Pagination from "~/components/modrinth/ui/base/Pagination.vue";
import AutoLink from "~/components/modrinth/ui/base/AutoLink.vue";
import Avatar from "~/components/modrinth/ui/base/Avatar.vue";
import Badge from "~/components/modrinth/ui/base/Badge.vue";
import InventoryTags from "~/components/modrinth/ui/base/InventoryTags.vue";
import { IconRefresh, IconRosetteDiscount, IconStar } from "@tabler/icons-vue";
import TagItem from "~/components/modrinth/ui/base/TagItem.vue";
const props = withDefaults(
    defineProps<{
        baseId?: string;
        inventory: any[];
        currentMember?: boolean;
        inventoryLink?: (inventory: any) => string | null;
    }>(),
    {
        baseId: undefined,
        currentMember: false,
        inventoryLink: undefined,
    },
);

const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(20);

const route = useRoute();
const router = useRouter();

if (route.query.page) {
    currentPage.value = Number(route.query.page) || 1;
}
function switchPage(page: number) {
    currentPage.value = page;

    router.replace({
        query: {
            ...route.query,
            page: currentPage.value !== 1 ? currentPage.value : undefined,
        },
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateQuery(
    newQueries: Record<string, string | string[] | undefined | null>,
) {
    if (newQueries.page) {
        currentPage.value = Number(newQueries.page);
    } else if (newQueries.page === undefined) {
        currentPage.value = 1;
    }

    router.replace({
        query: {
            ...route.query,
            ...newQueries,
        },
    });
}
</script>

<style scoped>
.inventory-grid-row {
    @apply grid grid-cols-[1fr_min-content] gap-4 supports-[grid-template-columns:subgrid]:col-span-full supports-[grid-template-columns:subgrid]:!grid-cols-subgrid sm:grid-cols-[min-content_1fr_1fr_1fr_min-content] xl:grid-cols-[min-content_1fr_1fr_1fr_1fr_1fr_min-content];
}
.inventory-list {
    width: 100%;
    gap: var(--spacing-card-md);
    overflow: hidden;

    &:not(:first-child) {
        margin-top: var(--spacing-card-md);
    }

    &:not(:empty) {
        margin-bottom: var(--spacing-card-md);
    }
}
.inventory-list.display-mode--grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media screen and (max-width: 80rem) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media screen and (max-width: 860px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media screen and (max-width: 550px) {
        display: flex;
        flex-direction: column;
    }
}
.inventory-card {
    display: inline-grid;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0;
}
.display-mode--grid .inventory-card {
    padding: 0 0 .5rem 0;
    grid-template: "gallery gallery" "icon title" "description  description" "tags tags" "stats stats";
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content min-content 1fr min-content min-content;
    row-gap: var(--spacing-card-sm);

    &.popular {
        outline: 3px solid var(--color-green);
    }
    .gallery {
        display: inline-block;
        width: 100%;
        height: 10rem;
        background-color: var(--color-button-bg-active);

        &.no-image {
            filter: brightness(0.7);
        }

        img {
            box-shadow: none;
            width: 100%;
            height: 10rem;
            object-fit: cover;
        }
    }

    .icon {
        margin-left: var(--spacing-card-bg);
        margin-top: -3rem;
        z-index: 1;

        img,
        svg {
            border-radius: var(--size-rounded-lg);
            box-shadow:
                -2px -2px 0 2px var(--color-raised-bg),
                2px -2px 0 2px var(--color-raised-bg);
        }
    }

    .title {
        margin-left: var(--spacing-card-md);
        margin-right: var(--spacing-card-bg);
        flex-direction: column;

        .name {
            font-size: 1.25rem;
        }

        /* .status {
            margin-top: var(--spacing-card-xs);
        } */
    }

    .description {
        margin-inline: var(--spacing-card-bg);
    }

    .tags {
        margin-inline: var(--spacing-card-bg);
    }

    .stats {
        margin-inline: var(--spacing-card-bg);
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;

        .stat-label {
            display: none;
        }

        .buttons {
            flex-direction: row;
            gap: var(--spacing-card-sm);
            align-items: center;

            > :first-child {
                margin-left: auto;
            }

            &:first-child > :last-child {
                margin-right: auto;
            }
        }

        .buttons:not(:empty) + .date {
            flex-basis: 100%;
        }
    }
}

.display-mode--grid .inventory-card {
    .gallery {
        display: none;
    }

    .icon {
        margin-top: calc(var(--spacing-card-bg) - var(--spacing-card-sm));

        img,
        svg {
            border: none;
        }
    }

    .title {
        margin-top: calc(var(--spacing-card-bg) - var(--spacing-card-sm));
    }
}
.icon {
    grid-area: icon;
    display: flex;
    align-items: center;
}

.gallery {
    display: none;
    height: 10rem;
    grid-area: gallery;
}

.title {
    grid-area: title;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--spacing-card-sm);
    row-gap: 0;
    word-wrap: anywhere;

    h2,
    p {
        margin: 0;
    }

    svg {
        width: auto;
        color: var(--color-orange);
        height: 1.5rem;
        margin-bottom: -0.25rem;
    }
}

.stats {
    grid-area: stats;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--spacing-card-md);

    .stat {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: fit-content;
        gap: var(--spacing-card-xs);
        --stat-strong-size: 1.25rem;

        strong {
            font-size: var(--stat-strong-size);
        }

        p {
            margin: 0;
        }

        svg {
            height: var(--stat-strong-size);
            width: var(--stat-strong-size);
        }
    }

    /* .date {
        margin-top: auto;
    } */

    @media screen and (max-width: 750px) {
        flex-direction: row;
        column-gap: var(--spacing-card-md);
        margin-top: var(--spacing-card-xs);
    }

    @media screen and (max-width: 600px) {
        margin-top: 0;

        .stat-label {
            display: none;
        }
    }
}

.environment {
    color: var(--color-text) !important;
    font-weight: bold;
}

.description {
    grid-area: description;
    margin-block: 0;
    display: flex;
    justify-content: flex-start;
}

.tags {
    grid-area: tags;
    display: flex;
    flex-direction: row;

    @media screen and (max-width: 550px) {
        margin-top: var(--spacing-card-xs);
    }
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-card-sm);
    align-items: flex-end;
    flex-grow: 1;
}

.small-mode {
    @media screen and (min-width: 750px) {
        grid-template:
            "icon title"
            "icon description"
            "icon tags"
            "stats stats" !important;
        grid-template-columns: min-content auto !important;
        grid-template-rows: min-content 1fr min-content min-content !important;

        .tags {
            margin-top: var(--spacing-card-xs) !important;
        }

        .stats {
            flex-direction: row;
            column-gap: var(--spacing-card-md) !important;
            margin-top: var(--spacing-card-xs) !important;

            .stat-label {
                display: none !important;
            }
        }
    }
}
</style>
