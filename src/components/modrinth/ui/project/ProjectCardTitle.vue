<template>
    <span
        class="project-card-title smart-clickable:underline-on-hover m-0 mb-[-2px] line-clamp-1 break-all pb-[2px] font-semibold leading-none text-contrast"
        :class="compact ? 'text-lg' : 'text-xl'"
    >
        {{ title }}
    </span>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	compact?: boolean
}>()
</script>

<style scoped>
@container (width < 550px) {
    .project-card-title {
        @apply text-base;
    }
}
</style>
