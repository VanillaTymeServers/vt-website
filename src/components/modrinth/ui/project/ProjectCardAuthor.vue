<template>
    <span class="line-clamp-1 break-all text-secondary font-normal max-w-fit w-full pb-[2px] mb-[-2px]">
        by
        <nuxt-link
            :to="'/user/' + author"
            style="color: inherit; text-decoration: none;"
            class="hover:underline"
        >
            {{ author }}
        </nuxt-link>
    </span>
</template>

<script setup>
defineProps({
    author: { type: String, required: true },
})
</script>