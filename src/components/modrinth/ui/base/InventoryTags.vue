<template>
  <div class="categories">
    <slot />
    <!-- <template v-for="tag in tags"></template>
    <span v-if="type === 'sale'">
      <IconRosetteDiscount aria-hidden="true" /> Sale -->
  </div>
</template>

<script>
import { IconRosetteDiscount } from '@tabler/icons-vue';
export default {
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    // type: {
    //   type: String,
    //   required: true,
    // }
  }
}
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  :deep(span) {
    display: flex;
    align-items: center;
    flex-direction: row;

    &:not(:last-child) {
      margin-right: var(--spacing-card-md);
    }

    &:not(.badge) {
      color: var(--color-icon);
    }

    svg {
      width: 1rem;
      margin-right: 0.2rem;
    }
  }
}
</style>