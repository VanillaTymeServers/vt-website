<template>
    <div class="experimental-styles-within grid gap-4 lg:grid-cols-[1fr_3fr]">
        <div>
                <NavStack :items="navItems" />
        </div>
        <div class="min-w-0">
            <NuxtPage
                v-model:project="project"
                v-model:members="members"
                v-model:inventory="inventory"
                v-model:all-members="allMembers"
                :current-member="currentMember"
                :patch-project="patchProject"
                :patch-icon="patchIcon"
                :reset-project="resetProject"
                :reset-organization="resetOrganization"
                :reset-members="resetMembers"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    IconAlignLeft,
    IconBook2,
    IconChartHistogram,
    IconGlobe,
    IconPhoto,
    IconInfoCircle,
    IconLink,
    IconTags,
    IconUsers,
    IconBrandMinecraft,
} from "@tabler/icons-vue";
import type { Project } from "~/utils/types";
import { isStaff } from "~/helpers/users";

import { useLocalStorage, useScroll } from "@vueuse/core";
import NavStack from "~/components/ui/NavStack.vue";
import NavStackItem from "~/components/ui/NavStackItem.vue";

const props = defineProps<{
    currentMember: any;
    patchProject: any;
    patchIcon: any;
    resetProject: any;
    resetOrganization: any;
    resetMembers: any;
}>();
const flags = useFeatureFlags();

const project = defineModel<Project>("project", { required: true });
const members = defineModel<any>("members");
const allMembers = defineModel<any>("allMembers");
const inventory = defineModel<any>("inventory");
const navItems = computed(() => {
    const base = `${project.value.project_type}/${project.value.slug ? project.value.slug : project.value.id}`;

    const items = [
        {
            link: `/${base}/settings`,
            label: "General",
            icon: IconInfoCircle,
        },
        flags.value.newProjectGeneralSettings
            ? {
                  link: `/${base}/settings/general`,
                  label: "General",
                  badge: "New",
                  icon: IconInfoCircle,
              }
            : null,
        {
            link: `/${base}/settings/tags`,
            label: "Tags",
            icon: IconTags,
        },
        {
            link: `/${base}/settings/description`,
            label: "Description",
            icon: IconAlignLeft,
        },
        {
            link: `/${base}/settings/gallery`,
            label: "Gallery",
            icon: IconPhoto,
        },
        {
            link: `/${base}/settings/links`,
            label: "Links",
            icon: IconLink,
        },
        {
            link: `/${base}/settings/members`,
            label: "Members",
            icon: IconUsers,
        },
        {
            link: `/${base}/settings/inventory`,
            label: "Inventory",
            icon: IconBrandMinecraft,
            matchNested: true,
        },
        {
            link: `/${base}/settings/analytics`,
            label: "Analytics",
            icon: IconChartHistogram,
        },
    ];
    return items.filter(Boolean) as any[];
});

const route = useRoute();
const collapsedChecklist = useLocalStorage(
    `project-checklist-collapsed-${project.value.id}`,
    false,
);

async function setProcessing() {
    startLoading();

    try {
        await useBaseFetch(`project/${project.value.id}`, {
            method: "PATCH",
            body: {
                status: "processing",
            },
        });

        project.value.status = "processing";
    } catch (err: any) {
        addNotification({
            title: "An error occurred",
            text: err.data ? err.data.description : err,
            type: "error",
        });
    }

    stopLoading();
}
const scroll = useScroll(window);
watch(route, () => {
    const scrollY = scroll.y.value;
    setTimeout(() => window.scrollTo(0, scrollY), 10);
});
</script>
