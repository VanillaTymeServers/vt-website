<template>
    <div
        v-tooltip="$dayjs(date).format('MMMM D, YYYY [at] h:mm A')"
        class="flex items-center gap-2 text-sm"
        style="color: var(--color-secondary);"
    >
        <IconRefresh v-if="type === 'updated'" class="w-5 h-5 shrink-0" aria-hidden="true" />
        <IconCalendar v-else class="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>{{ fromNow(date) }}</span>
    </div>
</template>

<script setup>
import { IconRefresh, IconCalendar } from '@tabler/icons-vue'

defineProps({
    date: { type: String, required: true },
    type: { type: String, default: 'updated' }, // 'updated' | 'published'
})
</script>