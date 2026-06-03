<template>
    <div v-if="follows" class="flex items-center gap-2 text-sm" style="color: var(--color-secondary);">
        <IconHeart class="w-5 h-5 shrink-0" aria-hidden="true" />
        <span class="font-medium">{{ follows }}</span>
    </div>
    <div v-if="stall_color || coordinates" class="flex items-center gap-2 text-sm" style="color: var(--color-secondary);">
        <IconCompass class="w-5 h-5 shrink-0" aria-hidden="true" />
        <span v-if="stall" class="font-medium">{{ capitalizeString(stall_color) }} stall</span>
        <span v-else-if="coordinates" class="font-medium">x {{ coordinates.x }}, z {{ coordinates.z }}</span>
    </div>
</template>

<script setup>
import { IconHeart, IconCompass } from '@tabler/icons-vue'

defineProps({
    follows: { type: String, default: null },
    stall: { type: Boolean, default: false },
    stall_color: { type: String, default: null },
    coordinates: { type: Object, default: null },
})
</script>