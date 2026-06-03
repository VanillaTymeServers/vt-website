<template>
    <Teleport v-if="flags.projectBackground" to="#fixed-background-teleport">
        <ProjectBackgroundGradient :project="project" />
    </Teleport>
    <div
        v-if="route.name.startsWith('type-id-settings')"
        class="normal-page no-sidebar"
    >
        <div class="normal-page__header">
            <div
                class="mb-4 flex flex-wrap items-center gap-x-2 gap-y-3 border-0 border-b-[1px] border-solid border-divider pb-4 text-lg font-semibold"
            >
                <nuxt-link
                    :to="`/${project.project_type}/${project.slug ? project.slug : project.id}`"
                    class="flex items-center gap-2 hover:underline hover:brightness-[--hover-brightness]"
                >
                    <Avatar :src="project.icon_url" size="32px" />
                    {{ project.title }}
                </nuxt-link>
                <IconChevronRight />
                <span class="flex grow font-extrabold text-contrast">
                    Settings
                </span>
                <div class="flex gap-2">
                    <ButtonStyled>
                        <nuxt-link to="/dashboard/shops">
                            <IconListDetails />
                            Visit shops dashboard
                        </nuxt-link>
                    </ButtonStyled>
                </div>
            </div>
            <ProjectMemberHeader
                v-if="currentMember && false"
                :project="project"
                :current-member="currentMember"
                :is-settings="route.name.startsWith('type-id-settings')"
                :route-name="route.name"
                :set-processing="setProcessing"
                :collapsed="collapsedChecklist"
                :toggle-collapsed="
                    () => (collapsedChecklist = !collapsedChecklist)
                "
                :all-members="allMembers"
                :update-members="updateMembers"
                :auth="auth"
                :tags="tags"
            />
        </div>
        <div class="normal-page__content">
            <ProjectMemberHeader
                v-if="currentMember"
                :project="project"
                :current-member="currentMember"
                :is-settings="route.name.startsWith('type-id-settings')"
                :route-name="route.name"
                :set-processing="setProcessing"
                :collapsed="collapsedChecklist"
                :toggle-collapsed="
                    () => (collapsedChecklist = !collapsedChecklist)
                "
                :all-members="allMembers"
                :update-members="updateMembers"
                :auth="auth"
                :tags="tags"
            />
            <!--
                v-model:featured-versions="featuredVersions"
            -->
            <NuxtPage
                v-model:project="project"
                v-model:inventory="inventory"
                v-model:members="members"
                v-model:all-members="allMembers"
                v-model:organization="organization"
                :current-member="currentMember"
                :patch-project="patchProject"
                :patch-icon="patchIcon"
                :reset-project="resetProject"
                :reset-organization="resetOrganization"
                :reset-members="resetMembers"
                :route="route"
            />
        </div>
    </div>
    <div v-else class="experimental-styles-within">
        <NewModal ref="settingsModal">
            <template #title>
                <Avatar
                    :src="project.icon_url"
                    :alt="project.title"
                    class="icon"
                    size="32px"
                />
                <span class="text-lg font-extrabold text-contrast">
                    Settings
                </span>
            </template>
        </NewModal>
        <div
            class="over-the-top-download-animation"
            :class="{ 'animation-hidden': !overTheTopDownloadAnimation }"
        >
            <div>
                <div
                    class="animation-ring-3 flex items-center justify-center rounded-full border-4 border-solid border-brand bg-brand-highlight opacity-40"
                ></div>
                <div
                    class="animation-ring-2 flex items-center justify-center rounded-full border-4 border-solid border-brand bg-brand-highlight opacity-60"
                ></div>
                <div
                    class="animation-ring-1 flex items-center justify-center rounded-full border-4 border-solid border-brand bg-brand-highlight"
                >
                    <IconDownload class="h-20 w-20 text-contrast" />
                </div>
            </div>
        </div>
        <!-- <CollectionCreateModal
            ref="modal_collection"
            :project-ids="[project.id]"
        /> -->
        <div
            class="new-page sidebar"
            :class="{
                'alt-layout': cosmetics.leftContentLayout,
            }"
        >
            <div class="normal-page__header relative my-4">
                <ProjectHeader :project="project" :member="!!currentMember">
                    <template #actions>
                        <ButtonStyled
                            v-if="auth.user && currentMember"
                            size="large"
                            color="brand"
                        >
                            <nuxt-link
                                :to="`/${project.project_type}/${project.slug ? project.slug : project.id}/settings`"
                                class="!font-bold"
                            >
                                <IconSettings aria-hidden="true" />
                                Edit shop
                            </nuxt-link>
                        </ButtonStyled>

                        <ButtonStyled size="large" circular>
                            <ClientOnly>
                                <button
                                    v-if="auth.user"
                                    v-tooltip="
                                        following ? `Unfollow` : `Follow`
                                    "
                                    :aria-label="
                                        following ? `Unfollow` : `Follow`
                                    "
                                    @click="userFollowProject(project)"
                                >
                                    <IconHeart
                                        :fill="
                                            following ? 'currentColor' : 'none'
                                        "
                                        aria-hidden="true"
                                    />
                                </button>
                                <nuxt-link
                                    v-else
                                    v-tooltip="'Follow'"
                                    to="/auth/sign-in"
                                    aria-label="Follow"
                                >
                                    <IconHeart aria-hidden="true" />
                                </nuxt-link>
                                <template #fallback>
                                    <nuxt-link
                                        v-tooltip="'Follow'"
                                        to="/auth/sign-in"
                                        aria-label="Follow"
                                    >
                                        <IconHeart aria-hidden="true" />
                                    </nuxt-link>
                                </template>
                            </ClientOnly>
                        </ButtonStyled>
                        <ButtonStyled size="large" circular type="transparent">
                            <OverflowMenu
                                :tooltip="'More options'"
                                :options="[
                                    {
                                        id: 'analytics',
                                        link: `/${project.project_type}/${project.slug ? project.slug : project.id}/settings/analytics`,
                                        hoverOnly: true,
                                        shown: auth.user && !!currentMember,
                                    },
                                    {
                                        divider: true,
                                        shown: auth.user && !!currentMember,
                                    },
                                    {
                                        id: 'moderation-checklist',
                                        action: () =>
                                            (showModerationChecklist = true),
                                        color: 'orange',
                                        hoverOnly: true,
                                        shown:
                                            auth.user &&
                                            tags.staffRoles.includes(
                                                auth.user.role,
                                            ) &&
                                            !showModerationChecklist,
                                    },
                                    {
                                        divider: true,
                                        shown:
                                            auth.user &&
                                            tags.staffRoles.includes(
                                                auth.user.role,
                                            ) &&
                                            !showModerationChecklist,
                                    },
                                    {
                                        id: 'report',
                                        action: () =>
                                            auth.user
                                                ? reportProject(project.id)
                                                : navigateTo('/auth/sign-in'),
                                        color: 'red',
                                        hoverOnly: true,
                                        shown: currentMember,
                                    },
                                    { id: 'copy-id', action: () => copyId() },
                                    {
                                        id: 'copy-permalink',
                                        action: () => copyPermaLink(),
                                    },
                                ]"
                                aria-label="More options"
                                :dropdown-id="`${baseId}-more-options`"
                            >
                                <IconDotsVertical aria-hidden="true" />
                                <template #analytics>
                                    <IconChartHistogram aria-hidden="true" />
                                    Analytics
                                </template>
                                <template #moderation-checklist>
                                    <IconScale aria-hidden="true" />
                                    Review shop
                                </template>
                                <template #report>
                                    <IconFlag aria-hidden="true" />
                                    Report
                                </template>
                                <template #copy-id>
                                    <IconCopy aria-hidden="true" />
                                    Copy ID
                                </template>
                                <template #copy-permalink>
                                    <IconCopy aria-hidden="true" />
                                    Copy permanent link
                                </template>
                            </OverflowMenu>
                        </ButtonStyled>
                    </template>
                </ProjectHeader>
                <ProjectMemberHeader
                    v-if="currentMember"
                    :project="project"
                    :current-member="currentMember"
                    :is-settings="route.name.startsWith('type-id-settings')"
                    :route-name="route.name"
                    :set-processing="setProcessing"
                    :collapsed="collapsedChecklist"
                    :toggle-collapsed="
                        () => (collapsedChecklist = !collapsedChecklist)
                    "
                    :all-members="allMembers"
                    :update-members="updateMembers"
                    :auth="auth"
                    :tags="tags"
                />
                <MessageBanner
                    v-if="project.status === 'archived'"
                    message-type="warning"
                    class="mb-4 mt-4"
                >
                    {{ project.title }} has been archived.
                    {{ project.title }} will not receive any further updates
                    unless the owner decides to unarchive the shop.
                </MessageBanner>
            </div>
            <div class="normal-page__sidebar">
                <!-- <ProjectSidebarCompatibility
                    :project="project"
                    :tags="tags"
                    class="card flex-card experimental-styles-within"
                /> -->
                <!-- <ProjectSidebarLinks
                    :project="project"
                    :link-target="$external()"
                    class="card flex-card experimental-styles-within"
                /> -->
                <ProjectSidebarCreators
                    :organization="organization"
                    :members="members"
                    :org-link="(slug) => `/organization/${slug}`"
                    :user-link="(username) => `/user/${username}`"
                    class="card flex-card experimental-styles-within"
                />
                <!-- TODO: Finish license modal and enable -->
                <div class="card flex-card experimental-styles-within">
                    <h2>Details</h2>
                    <div class="details-list">
                        <div
                            v-if="project.approved"
                            v-tooltip="
                                $dayjs(project.approved).format(
                                    'MMMM D, YYYY [at] h:mm A',
                                )
                            "
                            class="details-list__item"
                        >
                            <IconCalendar aria-hidden="true" />
                            <div>Published {{ publishedDate }}</div>
                        </div>
                        <div
                            v-else
                            v-tooltip="
                                $dayjs(project.published).format(
                                    'MMMM D, YYYY [at] h:mm A',
                                )
                            "
                            class="details-list__item"
                        >
                            <IconCalendar aria-hidden="true" />
                            <div>
                                Created
                                {{ createdDate }}
                            </div>
                        </div>
                        <div
                            v-if="
                                project.status === 'processing' &&
                                project.queued
                            "
                            v-tooltip="
                                $dayjs(project.queued).format(
                                    'MMMM D, YYYY [at] h:mm A',
                                )
                            "
                            class="details-list__item"
                        >
                            <IconScale aria-hidden="true" />
                            <div>Submitted {{ submittedDate }}</div>
                        </div>
                        <div
                            v-if="project.updated"
                            v-tooltip="
                                $dayjs(project.updated).format(
                                    'MMMM D, YYYY [at] h:mm A',
                                )
                            "
                            class="details-list__item"
                        >
                            <IconRefresh aria-hidden="true" />
                            <div>Updated {{ updatedDate }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="normal-page__content">
                <div class="overflow-x-auto">
                    <NavTabs :links="navLinks" class="mb-4" />
                </div>
                <NuxtPage
                    v-model:project="project"
                    v-model:members="members"
                    v-model:all-members="allMembers"
                    v-model:organization="organization"
                    v-model:inventory="inventory"
                    :current-member="currentMember"
                    :reset-project="resetProject"
                    :reset-organization="resetOrganization"
                    :reset-members="resetMembers"
                    :route="route"
                />
            </div>
        </div>
        <ModerationChecklist
            v-if="
                auth.user &&
                tags.staffRoles.includes(auth.user.role) &&
                showModerationChecklist
            "
            :project="project"
            :future-projects="futureProjects"
            :reset-project="resetProject"
        />
    </div>
</template>
<script setup>
import {
    IconBookmark,
    IconBook2,
    IconCalendar,
    IconChartArcs,
    IconCheck,
    IconCopy,
    IconAlignLeft,
    IconDownload,
    IconCopyright,
    IconExternalLink,
    IconPhoto,
    IconDeviceGamepad,
    IconHeart,
    IconInfoCircle,
    IconLink,
    IconDotsVertical,
    IconPlus,
    IconFlag,
    IconScale,
    IconSettings,
    IconTags,
    IconUsers,
    IconGitCommit,
    IconTool,
    IconRefresh,
    IconChartHistogram,
    IconBrandMinecraft,
    IconChevronRight,
    IconListDetails,
} from "@tabler/icons-vue";
import Avatar from "~/components/modrinth/ui/base/Avatar.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import Checkbox from "~/components/modrinth/ui/base/Checkbox.vue";
import NewModal from "~/components/modrinth/ui/modal/NewModal.vue";
import OverflowMenu from "~/components/modrinth/ui/base/OverflowMenu.vue";
import PopoutMenu from "~/components/modrinth/ui/base/PopoutMenu.vue";
import ProjectBackgroundGradient from "~/components/modrinth/ui/project/ProjectBackgroundGradient.vue";
import ProjectHeader from "~/components/modrinth/ui/project/ProjectHeader.vue";
import ProjectSidebarCompatibility from "~/components/modrinth/ui/project/ProjectSidebarCompatibility.vue";
import ProjectSidebarCreators from "~/components/modrinth/ui/project/ProjectSidebarCreators.vue";
import ProjectSidebarDetails from "~/components/modrinth/ui/project/ProjectSidebarDetails.vue";
import ProjectSidebarLinks from "~/components/modrinth/ui/project/ProjectSidebarLinks.vue";
import ScrollablePanel from "~/components/modrinth/ui/base/ScrollablePanel.vue";

import { formatCategory } from "~/utils/utils";
import { renderString } from "~/utils/parse";
import { isStaff } from "~/utils/users";
import { isUnderReview, isRejected } from "~/helpers/projects";
// import VersionSummary from "@modrinth/ui/src/components/version/VersionSummary.vue";
import { navigateTo } from "#app";
import dayjs from "dayjs";
// import ModrinthIcon from "~/assets/images/utils/modrinth.svg?component";
import Accordion from "~/components/ui/Accordion.vue";
// import AdPlaceholder from "~/components/ui/AdPlaceholder.vue";
import AutomaticAccordion from "~/components/ui/AutomaticAccordion.vue";
import Badge from "~/components/ui/Badge.vue";
import Breadcrumbs from "~/components/ui/Breadcrumbs.vue";
import CollectionCreateModal from "~/components/ui/CollectionCreateModal.vue";
import MessageBanner from "~/components/ui/MessageBanner.vue";
import ModerationChecklist from "~/components/ui/moderation/checklist/ModerationChecklist.vue";
import NavStack from "~/components/ui/NavStack.vue";
import NavStackItem from "~/components/ui/NavStackItem.vue";
import NavTabs from "~/components/ui/NavTabs.vue";
import ProjectMemberHeader from "~/components/ui/ProjectMemberHeader.vue";
import { userCollectProject } from "~/composables/user.js";
import { reportProject } from "~/utils/report-helpers.ts";

const data = useNuxtApp();
const route = useNativeRoute();
const config = useRuntimeConfig();
// const notifications = injectNotificationManager();

const auth = await useAuth();
const user = await useUser();

const tags = useTags();
const flags = useFeatureFlags();
const cosmetics = useCosmetics();

const settingsModal = ref();
const downloadModal = ref();
const overTheTopDownloadAnimation = ref();

const baseId = useId();

const getModrinthAppAccordion = ref();

const formatRelativeTime = useRelativeTime();

const createdDate = computed(() =>
    project.value.published
        ? formatRelativeTime(project.value.published)
        : "unknown",
);
const submittedDate = computed(() =>
    project.value.queued ? formatRelativeTime(project.value.queued) : "unknown",
);
const publishedDate = computed(() =>
    project.value.approved
        ? formatRelativeTime(project.value.approved)
        : "unknown",
);
const updatedDate = computed(() =>
    project.value.updated
        ? formatRelativeTime(project.value.updated)
        : "unknown",
);

if (
    !route.params.id ||
    !(
        tags.value.projectTypes.find((x) => x.id === route.params.type) ||
        route.params.type === "project"
    )
) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "The page could not be found",
    });
}

let project,
    resetProject,
    allMembers,
    resetMembers,
    organization,
    resetOrganization,
    inventory;
try {
    [
        { data: project, refresh: resetProject },
        { data: allMembers, refresh: resetMembers },
        { data: organization, refresh: resetOrganization },
        { data: inventory },
    ] = await Promise.all([
        useAsyncData(
            `project/${route.params.id}`,
            () => useBaseFetch(`project/${route.params.id}`),
            {
                transform: (project) => {
                    if (project) {
                        project.actualProjectType = JSON.parse(
                            JSON.stringify(project.project_type),
                        );
                        project.project_type = data.$getProjectTypeForUrl(
                            project.project_type,
                            project.loaders,
                            tags.value,
                        );
                    }

                    return project;
                },
            },
        ),
        useAsyncData(
            `project/${route.params.id}/members`,
            () =>
                useBaseFetch(`project/${route.params.id}/members`, {
                    apiVersion: 3,
                }),
            {
                transform: (members) => {
                    members.forEach((it, index) => {
                        members[index].avatar_url = it.user.avatar_url;
                        members[index].name = it.user.username;
                    });

                    return members;
                },
            },
        ),
        useAsyncData(`project/${route.params.id}/organization`, () =>
            useBaseFetch(`project/${route.params.id}/organization`, {
                apiVersion: 3,
            }),
        ),
        useAsyncData(`project/${route.params.id}/inventory`, () =>
            useBaseFetch(`project/${route.params.id}/inventory`, {
                apiVersion: 3,
            }),
        ),
    ]);
    // inventories = shallowRef(toRaw(inventories))
} catch {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "Shop not found",
    });
}
if (!project.value) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "Shop not found",
    });
}

if (
    project.value.project_type !== route.params.type ||
    route.params.id !== project.value.slug
) {
    let path = route.fullPath.split("/");
    path.splice(0, 3);
    path = path.filter((x) => x);

    await navigateTo(
        `/${project.value.project_type}/${project.value.slug}${
            path.length > 0 ? `/${path.join("/")}` : ""
        }`,
        { redirectCode: 301, replace: true },
    );
}

// Members should be an array of all members, without the accepted ones, and with the user with the Owner role at the start
// The rest of the members should be sorted by role, then by name
const members = computed(() => {
    const acceptedMembers = allMembers.value.filter((x) => x.accepted);
    const owner = acceptedMembers.find((x) =>
        organization.value
            ? organization.value.members.some(
                  (orgMember) =>
                      orgMember.user.id === x.user.id && orgMember.is_owner,
              )
            : x.is_owner,
    );

    const rest =
        acceptedMembers.filter((x) => !owner || x.user.id !== owner.user.id) ||
        [];

    rest.sort((a, b) => {
        if (a.role === b.role) {
            return a.user.username.localeCompare(b.user.username);
        } else {
            return a.role.localeCompare(b.role);
        }
    });

    return owner ? [owner, ...rest] : rest;
});

const currentMember = computed(() => {
    let val = auth.value.user
        ? allMembers.value.find((x) => x.user.id === auth.value.user.id)
        : null;

    if (
        !val &&
        auth.value.user &&
        organization.value &&
        organization.value.members
    ) {
        val = organization.value.members.find(
            (x) => x.user.id === auth.value.user.id,
        );
    }

    if (
        !val &&
        auth.value.user &&
        tags.value.staffRoles.includes(auth.value.user.role)
    ) {
        val = {
            team_id: project.team_id,
            user: auth.value.user,
            role: auth.value.role,
            permissions:
                auth.value.user.role === "admin" || auth.value.user.role === "moderator" || auth.value.user.role === "developer"
                    ? {
                          EDIT_DETAILS: true,
                          EDIT_BODY: true,
                          MANAGE_INVITES: true,
                          REMOVE_MEMBER: true,
                          EDIT_MEMBER: true,
                          DELETE_PROJECT: true,
                          VIEW_ANALYTICS: true,
                          CREATE_ITEMS: true,
                          EDIT_ITEMS: true,
                          DELETE_ITEMS: true,
                      }
                    : {
                          EDIT_DETAILS: false,
                          EDIT_BODY: false,
                          MANAGE_INVITES: false,
                          REMOVE_MEMBER: false,
                          EDIT_MEMBER: false,
                          DELETE_PROJECT: false,
                          VIEW_ANALYTICS: false,
                          CREATE_ITEMS: false,
                          EDIT_ITEMS: false,
                          DELETE_ITEMS: false,
                      },
            accepted: true,
            payouts_split: 0,
            avatar_url: auth.value.user.avatar_url,
            name: auth.value.user.username,
        };
    }

    return val;
});

const projectTypeDisplay = computed(() =>
    data.$formatProjectType(
        data.$getProjectTypeForDisplay(
            project.value.project_type,
            project.value.loaders,
        ),
    ),
);

const following = computed(
    () =>
        user.value &&
        user.value.follows &&
        user.value.follows.find((x) => x.id === project.value.id),
);

const title = computed(
    () => `${project.value.title} - Minecraft ${projectTypeDisplay.value}`,
);
const description = computed(
    () =>
        `${project.value.description} - Download the Minecraft ${projectTypeDisplay.value} ${
            project.value.title
        } by ${members.value.find((x) => x.is_owner)?.user?.username || "a Creator"} on Modrinth`,
);

if (!route.name.startsWith("type-id-settings")) {
    useSeoMeta({
        title: () => title.value,
        description: () => description.value,
        ogTitle: () => title.value,
        ogDescription: () => project.value.description,
        ogImage: () =>
            project.value.icon_url ??
            "https://cdn.modrinth.com/placeholder.png",
        robots: () =>
            project.value.status === "approved" ||
            project.value.status === "archived"
                ? "all"
                : "noindex",
    });
}

const onUserCollectProject = useClientTry(userCollectProject);

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
    } catch (err) {
        data.$notify({
            group: "main",
            title: "An error occurred",
            text: err.data.description,
            type: "error",
        });
    }

    stopLoading();
}

async function patchProject(resData, quiet = false) {
    let result = false;
    startLoading();

    try {
        await useBaseFetch(`project/${project.value.id}`, {
            method: "PATCH",
            body: resData,
        });

        for (const key in resData) {
            project.value[key] = resData[key];
        }

        result = true;
        if (!quiet) {
            data.$notify({
                group: "main",
                title: "Project updated",
                text: "Your project has been updated.",
                type: "success",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    } catch (err) {
        data.$notify({
            group: "main",
            title: "An error occurred",
            text: err.data.description,
            type: "error",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    stopLoading();

    return result;
}

async function patchIcon(icon) {
    let result = false;
    startLoading();

    try {
        await useBaseFetch(
            `project/${project.value.id}/icon?ext=${
                icon.type.split("/")[icon.type.split("/").length - 1]
            }`,
            {
                method: "PATCH",
                body: icon,
            },
        );
        await resetProject();
        result = true;
        data.$notify({
            group: "main",
            title: "Shop icon updated",
            text: "Your shop's icon has been updated.",
            type: "success",
        });
    } catch (err) {
        data.$notify({
            group: "main",
            title: "An error occurred",
            text: err.data.description,
            type: "error",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    stopLoading();
    return result;
}

async function updateMembers() {
    allMembers.value = await useAsyncData(
        `project/${route.params.id}/members`,
        () => useBaseFetch(`project/${route.params.id}/members`),
        {
            transform: (members) => {
                members.forEach((it, index) => {
                    members[index].avatar_url = it.user.avatar_url;
                    members[index].name = it.user.username;
                });

                return members;
            },
        },
    );
}

async function copyId() {
    await navigator.clipboard.writeText(project.value.id);
}

async function copyPermaLink() {
    await navigator.clipboard.writeText(
        `${config.public.siteUrl}/shop/${project.value.id}`,
    );
}

const collapsedChecklist = ref(false);

const showModerationChecklist = ref(false);
const futureProjects = ref([]);
if (
    import.meta.client &&
    history &&
    history.state &&
    history.state.showChecklist
) {
    showModerationChecklist.value = true;
    futureProjects.value = history.state.projects;
}

const navLinks = computed(() => {
    const projectUrl = `/${project.value.project_type}/${project.value.slug ? project.value.slug : project.value.id}`;

    return [
        {
            label: "Description",
            href: projectUrl,
        },
        {
            label: "Inventory",
            href: `${projectUrl}/inventory`,
            // shown: project.value.inventory.length > 0 || !!currentMember.value,
        },
        {
            label: "Gallery",
            href: `${projectUrl}/gallery`,
            shown: project.value.gallery.length > 0 || !!currentMember.value,
        },
        {
            label: "Moderation",
            href: `${projectUrl}/moderation`,
            shown:
                !!currentMember.value &&
                (isRejected(project.value) ||
                    isUnderReview(project.value) ||
                    isStaff(auth.value.user)),
        },
    ];
});
</script>
<style lang="scss" scoped>
.settings-header {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-card-sm);
    align-items: center;
    margin-bottom: var(--spacing-card-bg);

    .settings-header__icon {
        flex-shrink: 0;
    }

    .settings-header__text {
        h1 {
            font-size: var(--font-size-md);
            margin-top: 0;
            margin-bottom: var(--spacing-card-sm);
        }
    }
}

.popout-checkbox {
    padding: var(--gap-sm) var(--gap-md);
    white-space: nowrap;

    &:hover {
        filter: brightness(0.95);
    }
}

.popout-heading {
    padding: var(--gap-sm) var(--gap-md);
    padding-bottom: 0;
    font-size: var(--font-size-nm);
    color: var(--color-secondary);
}

.collection-button {
    margin: var(--gap-sm) var(--gap-md);
    white-space: nowrap;
}

.menu-text {
    padding: 0 var(--gap-md);
    font-size: var(--font-size-nm);
    color: var(--color-secondary);
}

.menu-search {
    margin: var(--gap-sm) var(--gap-md);
    width: calc(100% - var(--gap-md) * 2);
}

.collections-list {
    max-height: 40rem;
    overflow-y: auto;
    background-color: var(--color-bg);
    border-radius: var(--radius-md);
    margin: var(--gap-sm) var(--gap-md);
    padding: var(--gap-sm);
}

.normal-page__info:empty {
    display: none;
}

:deep(.accordion-with-bg) {
    @apply rounded-2xl bg-bg p-2;
    --scrollable-pane-bg: var(--color-bg);
}

.over-the-top-download-animation {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    scale: 0.5;
    transition: all 0.5s ease-out;
    opacity: 1;

    &.animation-hidden {
        scale: 0.8;
        opacity: 0;

        .animation-ring-1 {
            width: 25rem;
            height: 25rem;
        }
        .animation-ring-2 {
            width: 50rem;
            height: 50rem;
        }
        .animation-ring-3 {
            width: 100rem;
            height: 100rem;
        }
    }

    > div {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        height: fit-content;

        > * {
            position: absolute;
            scale: 1;
            transition: all 0.2s ease-out;
            width: 20rem;
            height: 20rem;
        }
    }
}

@media (hover: none) and (max-width: 767px) {
    .modrinth-app-section {
        display: none;
    }
}
</style>
