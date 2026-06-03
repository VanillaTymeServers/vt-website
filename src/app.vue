<template>
    <NuxtLayout>
        <NuxtRouteAnnouncer />
        <ClientOnly>
            <LoadingBar />
        </ClientOnly>
        <Notifications />
        <NuxtPage />
    </NuxtLayout>
</template>
<script setup lang="ts">
import LoadingBar from "~/components/modrinth/ui/base/LoadingBar.vue";
import Notifications from "~/components/ui/Notifications.vue";
</script>
