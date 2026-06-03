<template>
    <div class="package-list display-mode--grid">
        <template v-for="(pkg, index) in packages" :key="index">
            <article class="package-card base-card padding-bg">
                <nuxt-link
                    :title="pkg.name"
                    class="icon"
                    tabindex="-1"
                    :to="`/store/package/${pkg.id}`"
                >
                    <Avatar
                        :src="pkg.image"
                        size="md"
                        :alt="pkg.name"
                        no-shadow
                        loading="lazy"
                    />
                </nuxt-link>
                <div class="title">
                    <nuxt-link :to="`/store/package/${pkg.id}`">
                        <h2 class="name !text-2xl">
                            {{ pkg.name }}
                        </h2>
                    </nuxt-link>
                    <div class="my-1">
                        <TagItem>{{ pkg.category.name }}</TagItem>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <template v-if="pkg.discount" >
                            <strong class="text-red" >
                                ${{ pkg.total_price }}
                            </strong>
                            <sub>
                                <strike>
                                    ${{ pkg.base_price + pkg.discount }}
                                </strike>
                            </sub>
                        </template>
                        <template v-else>
                            <strong class=""> ${{ pkg.total_price }} </strong>
                        </template>
                    </div>
                    <div class="stat">
                        <button class="iconified-button brand-button">
                            Details
                        </button>
                    </div>
                </div>
            </article>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { IconCurrencyDollar } from "@tabler/icons-vue";
import Avatar from "~/components/modrinth/ui/base/Avatar.vue";
import TagItem from "~/components/modrinth/ui/base/TagItem.vue";
const props = withDefaults(
    defineProps<{
        packages: any[];
    }>(),
    {
        packages: () => [],
    },
);
</script>

<style scoped>
.packages-grid-row {
    @apply grid grid-cols-[1fr_min-content] gap-4 supports-[grid-template-columns:subgrid]:col-span-full supports-[grid-template-columns:subgrid]:!grid-cols-subgrid sm:grid-cols-[min-content_1fr_1fr_1fr_min-content] xl:grid-cols-[min-content_1fr_1fr_1fr_1fr_1fr_min-content];
}
.package-list {
    width: 100%;
    gap: var(--spacing-card-md);
    overflow: hidden;

    /* &:not(:first-child) {
        margin-top: var(--spacing-card-md);
    } */

    /* &:not(:empty) {
        margin-bottom: var(--spacing-card-md);
    } */
}
.package-list.display-mode--grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

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
.package-card {
    display: inline-grid;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0;
}
.display-mode--grid .package-card {
    padding: 0 0 var(--spacing-card-bg) 0;
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
        flex-direction: row;
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

.display-mode--grid .package-card {
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
