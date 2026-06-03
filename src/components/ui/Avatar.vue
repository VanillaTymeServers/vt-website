<template>
  <Avatar
    :src="src"
    :alt="alt"
    :size="size"
    :circle="circle"
    :no-shadow="noShadow"
    :loading="loading"
    :raised="raised"
  />
</template>

<script setup>
import Avatar  from "~/components/modrinth/ui/base/Avatar.vue";

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "2rem",
  },
  circle: {
    type: Boolean,
    default: false,
  },
  noShadow: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: String,
    default: "eager",
  },
  raised: {
    type: Boolean,
    default: false,
  },
});
</script>
