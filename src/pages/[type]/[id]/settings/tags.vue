<template>
    <div>
        <section class="universal-card">
            <div class="label">
                <h3>
                    <span class="label__title size-card-header">Tags</span>
                </h3>
            </div>

            <div
                v-if="tooManyTagsWarning && !allTagsSelectedWarning"
                class="my-2 flex items-center gap-1.5 text-orange"
            >
                <IconAlertTriangle class="my-auto" />
                {{ tooManyTagsWarning }}
            </div>

            <div
                v-if="allTagsSelectedWarning"
                class="my-2 flex items-center gap-1.5 text-red"
            >
                <IconAlertTriangle class="my-auto" />
                <span>{{ allTagsSelectedWarning }}</span>
            </div>

            <p>
                Accurate tagging is important to help people find your
                {{ formatProjectType(project.project_type).toLowerCase() }}.
                Make sure to select all tags that apply.
            </p>
            <template
                v-for="header in Object.keys(categoryLists)"
                :key="`categories-${header}`"
            >
                <div class="label mb-3">
                    <h4>
                        <span class="label__title">{{
                            formatCategoryHeader(header)
                        }}</span>
                    </h4>
                    <span class="label__description">
                        <template v-if="header === 'categories'">
                            Select all categories that reflect the themes or
                            function of your
                            {{
                                formatProjectType(
                                    project.project_type,
                                ).toLowerCase()
                            }}.
                        </template>
                        <template v-else-if="header === 'features'">
                            Select all of the features that your
                            {{
                                formatProjectType(
                                    project.project_type,
                                ).toLowerCase()
                            }}
                            makes use of.
                        </template>
                    </span>
                </div>
                <div class="category-list input-div">
                    <Checkbox
                        v-for="category in categoryLists[header]"
                        :key="`category-${header}-${category.name}`"
                        :model-value="selectedTags.includes(category)"
                        :description="formatCategory(category.name)"
                        class="category-selector"
                        @update:model-value="toggleCategory(category)"
                    >
                        <div class="category-selector__label">
                            <div
                                v-if="header !== 'resolutions' && category.icon"
                                aria-hidden="true"
                                class="icon"
                                v-html="category.icon"
                            />
                            <span aria-hidden="true">
                                {{ formatCategory(category.name) }}</span
                            >
                        </div>
                    </Checkbox>
                </div>
            </template>
            <div class="label">
                <h4>
                    <span class="label__title"><IconStar /> Featured tags</span>
                </h4>
                <span class="label__description">
                    You can feature up to 3 of your most relevant tags. Other
                    tags may be promoted to featured if you do not select all 3.
                </span>
            </div>
            <p v-if="selectedTags.length < 1">
                Select at least one category in order to feature a category.
            </p>
            <div class="category-list input-div">
                <Checkbox
                    v-for="category in selectedTags"
                    :key="`featured-category-${category.name}`"
                    class="category-selector"
                    :model-value="featuredTags.includes(category)"
                    :description="formatCategory(category.name)"
                    :disabled="
                        featuredTags.length >= 3 &&
                        !featuredTags.includes(category)
                    "
                    @update:model-value="toggleFeaturedCategory(category)"
                >
                    <div class="category-selector__label">
                        <div
                            v-if="
                                category.header !== 'resolutions' &&
                                category.icon
                            "
                            aria-hidden="true"
                            class="icon"
                            v-html="category.icon"
                        />
                        <span aria-hidden="true">
                            {{ formatCategory(category.name) }}</span
                        >
                    </div>
                </Checkbox>
            </div>

            <div class="button-group">
                <button
                    type="button"
                    class="iconified-button brand-button"
                    :disabled="!hasChanges"
                    @click="saveChanges()"
                >
                    <IconDeviceFloppy />
                    Save changes
                </button>
            </div>
        </section>
    </div>
</template>

<script>
import {
    IconStar,
    IconDeviceFloppy,
    IconAlertTriangle,
} from "@tabler/icons-vue";
import {
    formatCategory,
    formatCategoryHeader,
    formatProjectType,
} from "#imports";
import Checkbox from "~/components/ui/Checkbox.vue";
import { computed } from "vue";
import { useSavable } from "~/composables/savable";

export default defineNuxtComponent({
    components: {
        Checkbox,
        IconStar,
        IconDeviceFloppy,
        IconAlertTriangle,
    },
    props: {
        project: {
            type: Object,
            default() {
                return {};
            },
        },
        allMembers: {
            type: Array,
            default() {
                return [];
            },
        },
        currentMember: {
            type: Object,
            default() {
                return null;
            },
        },
        patchProject: {
            type: Function,
            default() {
                return () => {
                    this.$notify({
                        group: "main",
                        title: "An error occurred",
                        text: "Patch shop function not found",
                        type: "error",
                    });
                };
            },
        },
    },
    setup(props) {
        const nuxtApp = useNuxtApp();

        const actualProjectType = computed(
            () => props.project?.actualProjectType ?? props.project?.project_type,
        );

        const sortedCategories = computed(() => {
            const fn = nuxtApp?.$sortedCategories;
            if (typeof fn !== "function") return [];
            return fn();
        });

        const { saved, current, saving, reset, save, hasChanges } = useSavable(
            () => ({
                selectedTags: sortedCategories.value.filter(
                    (x) =>
                        x.project_type === actualProjectType.value &&
                        ((props.project?.categories ?? []).includes(x.name) ||
                            (props.project?.additional_categories ?? []).includes(
                                x.name,
                            )),
                ),
                featuredTags: sortedCategories.value.filter(
                    (x) =>
                        x.project_type === actualProjectType.value &&
                        (props.project?.categories ?? []).includes(x.name),
                ),
            }),
            async () => {
                // Promote selected categories to featured if there are less than 3 featured
                const newFeaturedTags = current.value.featuredTags.slice();
                if (
                    newFeaturedTags.length < 1 &&
                    current.value.selectedTags.length > newFeaturedTags.length
                ) {
                    const nonFeaturedCategories =
                        current.value.selectedTags.filter(
                            (x) => !newFeaturedTags.includes(x),
                        );

                    nonFeaturedCategories
                        .slice(
                            0,
                            Math.min(
                                nonFeaturedCategories.length,
                                3 - newFeaturedTags.length,
                            ),
                        )
                        .forEach((x) => newFeaturedTags.push(x));
                }

                // Convert selected and featured categories to backend-usable arrays
                const categories = newFeaturedTags.map((x) => x.name);
                const additionalCategories = current.value.selectedTags
                    .filter((x) => !newFeaturedTags.includes(x))
                    .map((x) => x.name);

                const projectCategories = props.project?.categories ?? [];
                const projectAdditionalCategories =
                    props.project?.additional_categories ?? [];

                const data = {};

                if (
                    categories.length !== projectCategories.length ||
                    categories.some((value) => !projectCategories.includes(value))
                ) {
                    data.categories = categories;
                }

                if (
                    additionalCategories.length !==
                        projectAdditionalCategories.length ||
                    additionalCategories.some(
                        (value) => !projectAdditionalCategories.includes(value),
                    )
                ) {
                    data.additional_categories = additionalCategories;
                }

                await props.patchProject(data);
            },
        );

        const selectedTags = computed({
            get: () => current.value.selectedTags,
            set: (v) => {
                current.value.selectedTags = v;
            },
        });

        const featuredTags = computed({
            get: () => current.value.featuredTags,
            set: (v) => {
                current.value.featuredTags = v;
            },
        });

        return {
            saved,
            current,
            saving,
            reset,
            save,
            hasChanges,
            selectedTags,
            featuredTags,
        };
    },
    computed: {
        tooManyTagsWarning() {
            const tagCount = this.selectedTags.length;
            if (tagCount > 8) {
                return `You have selected ${tagCount} tags. It's recommended to select 8 or fewer to keep your ${formatProjectType(this.project.project_type).toLowerCase()} focused and easier to discover.`;
            }
        },
        allTagsSelectedWarning() {
            const categoriesForType = this.$sortedCategories().filter(
                (x) => x.project_type === this.project.actualProjectType,
            );
            const totalSelectedTags = this.selectedTags.length;
            if (
                totalSelectedTags === categoriesForType.length &&
                totalSelectedTags > 0
            ) {
                return `You have selected all ${categoriesForType.length} available tags. Please select only tags that truly apply to your ${formatProjectType(this.project.project_type).toLowerCase()}.`;
            }
        },
        categoryLists() {
            const lists = {};
            this.$sortedCategories().forEach((x) => {
                if (x.project_type === this.project.actualProjectType) {
                    const header = x.header;
                    if (!lists[header]) {
                        lists[header] = [];
                    }
                    lists[header].push(x);
                }
            });
            return lists;
        },
    },
    methods: {
        formatProjectType,
        formatCategoryHeader,
        formatCategory,
        toggleCategory(category) {
            if (this.selectedTags.includes(category)) {
                this.selectedTags = this.selectedTags.filter(
                    (x) => x !== category,
                );
                if (this.featuredTags.includes(category)) {
                    this.featuredTags = this.featuredTags.filter(
                        (x) => x !== category,
                    );
                }
            } else {
                this.selectedTags.push(category);
            }
        },
        toggleFeaturedCategory(category) {
            if (this.featuredTags.includes(category)) {
                this.featuredTags = this.featuredTags.filter(
                    (x) => x !== category,
                );
            } else {
                this.featuredTags.push(category);
            }
        },
        saveChanges() {
            this.save();
        },
    },
});
</script>
<style lang="scss" scoped>
.label__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-card-xs);
    margin-top: var(--spacing-card-bg);

    svg {
        vertical-align: top;
    }
}

.button-group {
    justify-content: flex-start;
}

.category-list {
    column-count: 4;
    column-gap: var(--spacing-card-lg);
    margin-bottom: var(--spacing-card-md);

    :deep(.category-selector) {
        margin-bottom: 0.75rem;

        .category-selector__label {
            display: flex;
            align-items: center;

            .icon {
                height: 1rem;

                svg {
                    margin-right: 0.25rem;
                    width: 1rem;
                    height: 1rem;
                }
            }
        }

        span {
            user-select: none;
        }
    }

    @media only screen and (max-width: 1250px) {
        column-count: 3;
    }
    @media only screen and (max-width: 1024px) {
        column-count: 4;
    }
    @media only screen and (max-width: 960px) {
        column-count: 3;
    }
    @media only screen and (max-width: 750px) {
        column-count: 2;
    }
    @media only screen and (max-width: 530px) {
        column-count: 1;
    }
}
</style>
