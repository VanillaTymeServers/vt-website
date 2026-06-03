<template>
  <div class="categories">
    <slot />
    <span
      v-for="category in categoriesFiltered"
      :key="category.name"
      v-html="category.icon + $formatCategory(category.name)"
    />
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const tags = useTags();

    return { tags };
  },
  computed: {
    categoriesFiltered() {
      return this.tags.categories
        .filter(
          (x) =>
            this.categories.includes(x.name) && (!x.project_type || x.project_type === this.type),
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.375rem;

  :deep(span) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--color-button-bg);
    border: 1px solid var(--color-button-border);
    border-radius: 999px;
    padding: 0.25rem 0.625rem;
    font-size: 0.875rem;
    line-height: 1;
    color: var(--color-secondary);
    white-space: nowrap;

    &:not(.badge) {
      color: var(--color-secondary);
    }

    svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }
  }
}
</style>
