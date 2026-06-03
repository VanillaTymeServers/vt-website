<template>
    <span v-if="typeOnly" class="environment">
        <IconInfoCircle aria-hidden="true" />
        A {{ type }}
    </span>
    <span
        v-else-if="
            !['resourcepack', 'shader'].includes(type) &&
            !(type === 'plugin' && search) &&
            !categories.some((x) => tags.loaderData.dataPackLoaders.includes(x))
        "
        class="environment"
    >
        <template v-if="type === 'stall'">
            <IconShoppingCart aria-hidden="true" />
            Stall
        </template>
        <template v-if="type === 'shop'">
            <IconBuildingStore aria-hidden="true" />
            Shop
        </template>
        <template v-else-if="alwaysShow">
            <IconInfoCircle aria-hidden="true" />
            A {{ type }}
        </template>
    </span>
</template>
<script setup>
import {
    IconInfoCircle,
    IconBuildingStore,
    IconShoppingCart,
} from "@tabler/icons-vue";
defineProps({
    type: {
        type: String,
        default: "stall",
    },
    typeOnly: {
        type: Boolean,
        required: false,
        default: false,
    },
    alwaysShow: {
        type: Boolean,
        required: false,
        default: false,
    },
    search: {
        type: Boolean,
        required: false,
        default: false,
    },
    categories: {
        type: Array,
        required: false,
        default() {
            return [];
        },
    },
});

const tags = useTags();
</script>
<style lang="scss" scoped>
.environment {
    display: flex;
    color: var(--color-text) !important;
    font-weight: bold;
    svg {
        margin-right: 0.2rem;
    }
}
</style>
