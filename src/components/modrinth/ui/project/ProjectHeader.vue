<template>
    <ContentPageHeader>
        <template #icon>
            <Avatar :src="project.icon_url" :alt="project.title" size="96px" />
        </template>
        <template #title>
            {{ project.title }}
        </template>
        <template #title-suffix>
            <ProjectStatusBadge
                v-if="member || project.status !== 'approved'"
                :status="project.status"
            />
        </template>
        <template #summary>
            {{ project.description }}
        </template>
        <template #stats>
            <div
                v-tooltip="() => 'Coordinates'"
                class="flex cursor-help items-center gap-2 border-0 border-r border-solid border-divider pr-4 font-semibold"
            >
                <IconCompass class="h-6 w-6 text-secondary" />
                <template v-if="project.stall">
                    {{ capitalizeString(project.stall_color) }} stall
                </template>
                <template v-else>
                    {{ project.coordinates.x }}, {{ project.coordinates.z }}
                </template>
            </div>
            <div
                v-tooltip="
                    `${formatNumber(project.followers, false)} follower${project.downloads !== 1 ? 's' : ''}`
                "
                class="flex cursor-help items-center gap-2 border-0 border-solid border-divider pr-4"
                :class="{ 'md:border-r': project.categories.length > 0 }"
            >
                <IconHeart class="h-6 w-6 text-secondary" />
                <span class="font-semibold">
                    {{ formatNumber(project.followers) }}
                </span>
            </div>
            <div
                v-if="project.categories.length > 0"
                class="hidden items-center gap-2 md:flex"
            >
                <IconTags class="h-6 w-6 text-secondary" />
                <div class="flex flex-wrap gap-2">
                    <TagItem
                        v-for="(category, index) in project.categories"
                        :key="index"
                        :action="
                            () =>
                                router.push(
                                    `/${project.project_type}s?f=categories:${category}`,
                                )
                        "
                    >
                        {{ formatCategory(category) }}
                    </TagItem>
                </div>
            </div>
        </template>
        <template #actions>
            <slot name="actions" />
        </template>
    </ContentPageHeader>
</template>
<script setup lang="ts">
import {
    IconChevronDown,
    IconHeart,
    IconTags,
    IconCompass,
} from "@tabler/icons-vue";
import Avatar from "~/components/modrinth/ui/base/Avatar.vue";
import ContentPageHeader from "~/components/modrinth/ui/base/ContentPageHeader.vue";
import { formatCategory, formatNumber } from "#imports";
import { useRouter } from "vue-router";
import TagItem from "~/components/modrinth/ui/base/TagItem.vue";
import ProjectStatusBadge from "~/components/modrinth/ui/project/ProjectStatusBadge.vue";

const router = useRouter();

withDefaults(
    defineProps<{
        project: Project;
        member?: boolean;
    }>(),
    {
        member: false,
    },
);
</script>
