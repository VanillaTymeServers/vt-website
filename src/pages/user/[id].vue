<template>
    <div v-if="user" class="experimental-styles-within">
        <ModalCreation ref="modal_creation" />
        <CollectionCreateModal ref="modal_collection_creation" />
        <NewModal
            v-if="auth.user && isStaff(auth.user)"
            ref="userDetailsModal"
            header="User details"
        >
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                    <span class="text-lg font-bold text-primary">Uuid</span>
                    <div>
                        <span
                            v-tooltip="
                                user.username
                            "
                            class="flex w-fit items-center gap-1"
                        >
                            <span>{{ user.uuid }}</span>
                        </span>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="text-lg font-bold text-primary">
                        Role
                    </span>
                    <span>{{ capitalizeString(user.role) }}</span>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="text-lg font-bold text-primary">
                        Payment methods</span
                    >
                    <span>
                        <template v-if="user.payout_data?.paypal_address">
                            Paypal ({{ user.payout_data.paypal_address }} -
                            {{ user.payout_data.paypal_country }})
                        </template>
                        <template
                            v-if="
                                user.payout_data?.paypal_address &&
                                user.payout_data?.venmo_address
                            "
                        >
                            ,
                        </template>
                        <template v-if="user.payout_data?.venmo_address">
                            Venmo ({{ user.payout_data.venmo_address }})
                        </template>
                    </span>
                </div>
            </div>
        </NewModal>
        <div
            class="new-page sidebar"
            :class="{ 'alt-layout': cosmetics.leftContentLayout }"
        >
            <div class="normal-page__header py-4">
                <ContentPageHeader>
                    <template #icon>
                        <Avatar
                            :src="user.avatar_url"
                            :alt="user.username"
                            size="96px"
                            circle
                        />
                    </template>
                    <template #title>
                        {{ user.username }}
                    </template>
                    <template #summary>
                        {{ user.bio ? user.bio : "A Vanilla Tyme member" }}
                    </template>
                    <template #stats>
                        <div
                            class="flex items-center gap-2 border-0 border-r border-solid border-divider pr-4 font-semibold"
                        >
                            <IconBox class="h-6 w-6 text-secondary" />
                            {{ projects?.length || 0 }}
                            Shops
                        </div>
                        <div
                            v-tooltip="
                                `${new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(user.created))} at ${new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(user.created))}`
                            "
                            class="flex items-center gap-2 font-semibold"
                        >
                            <IconCalendar class="h-6 w-6 text-secondary" />
                            Joined
                            {{ formatRelativeTime(user.created) }}
                        </div>
                    </template>
                    <template #actions>
                        <ButtonStyled size="large">
                            <NuxtLink
                                v-if="auth.user && auth.user.id === user.id"
                                to="/settings/profile"
                            >
                                <IconEdit aria-hidden="true" />
                                Edit
                            </NuxtLink>
                        </ButtonStyled>
                        <ButtonStyled size="large" circular type="transparent">
                            <OverflowMenu
                                :options="[
                                    {
                                        id: 'manage-projects',
                                        action: () =>
                                            navigateTo('/dashboard/shops'),
                                        hoverOnly: true,
                                        shown:
                                        auth.user &&
                                            auth.user.id === user.id,
                                    },
                                    {
                                        divider: true,
                                        shown:
                                            auth.user &&
                                            auth.user.id === user.id,
                                    },
                                    {
                                        id: 'report',
                                        action: () =>
                                            auth.user
                                                ? reportUser(user.id)
                                                : navigateTo('/auth/sign-in'),
                                        color: 'red',
                                        hoverOnly: true,
                                        shown: auth.user?.id !== user.id,
                                    },
                                    { id: 'copy-id', action: () => copyId() },
                                    {
                                        id: 'open-info',
                                        action: () =>
                                            $refs.userDetailsModal.show(),
                                        shown: auth.user && isStaff(auth.user),
                                    },
                                ]"
                                aria-label="More options"
                            >
                                <IconDotsVertical aria-hidden="true" />
                                <template #manage-projects>
                                    <IconBox aria-hidden="true" />
                                    Manage shops
                                </template>
                                <template #report>
                                    <IconFlag aria-hidden="true" />
                                    Report
                                </template>
                                <template #copy-id>
                                    <IconCopy aria-hidden="true" />
                                    Copy id
                                </template>
                                <template #open-info>
                                    <IconInfoCircle aria-hidden="true" />
                                    View user details
                                </template>
                            </OverflowMenu>
                        </ButtonStyled>
                    </template>
                </ContentPageHeader>
            </div>
            <div class="normal-page__content">
                <div
                    v-if="navLinks.length >= 2"
                    class="mb-4 max-w-full overflow-x-auto"
                >
                    <NavTabs :links="navLinks" />
                </div>
                <div v-if="projects.length > 0">
                    <div
                        v-if="route.params.projectType !== 'collections'"
                        :class="
                            'project-list display-mode--' +
                            cosmetics.searchDisplayMode.user
                        "
                    >
                        <ProjectCard
                            v-for="project in (route.params.projectType !==
                            undefined
                                ? projects.filter(
                                      (x) =>
                                          x.project_type ===
                                          route.params.projectType.substr(
                                              0,
                                              route.params.projectType.length -
                                                  1,
                                          ),
                                  )
                                : projects
                            )
                                .slice()
                                .sort((a, b) => b.downloads - a.downloads)"
                            :id="project.slug || project.id"
                            :key="project.id"
                            :name="project.title"
                            :stall="project.stall"
                            :coordinates="project.coordinates"
                            :stall_color="project.stall_color"
                            :display="cosmetics.searchDisplayMode.user"
                            :featured-image="
                                project.gallery.find(
                                    (element) => element.featured,
                                )?.url
                            "
                            :description="project.description"
                            :created-at="project.published"
                            :updated-at="project.updated"
                            :follows="project.followers.toString()"
                            :icon-url="project.icon_url"
                            :categories="project.categories"
                            :status="
                                auth.user &&
                                (auth.user.id === user.id ||
                                    tags.staffRoles.includes(auth.user.role))
                                    ? project.status
                                    : null
                            "
                            :type="project.project_type"
                            :color="project.color"
                        />
                    </div>
                </div>
                <div
                    v-else-if="route.params.projectType !== 'collections'"
                    class="error"
                >
                    <!-- <UpToDate class="icon" /><br /> -->
                    <span
                        v-if="auth.user && auth.user.id === user.id"
                        class="preserve-lines text"
                    >
                        <!-- <IntlFormatted
                            :message-id="messages.profileNoProjectsAuthLabel"
                        >
                            <template #create-link="{ children }">
                                <a
                                    class="link"
                                    @click.prevent="$refs.modal_creation.show()"
                                >
                                    <component :is="() => children" />
                                </a>
                            </template>
                        </IntlFormatted> -->
                    </span>
                    <span v-else class="text">This user has no shops!</span>
                </div>
                <!-- <div
                    v-if="['collections'].includes(route.params.projectType)"
                    class="collections-grid"
                >
                    <nuxt-link
                        v-for="collection in collections"
                        :key="collection.id"
                        :to="`/collection/${collection.id}`"
                        class="card collection-item"
                    >
                        <div class="collection">
                            <Avatar :src="collection.icon_url" class="icon" />
                            <div class="details">
                                <h2 class="title">{{ collection.name }}</h2>
                                <div class="stats">
                                    <LibraryIcon aria-hidden="true" />
                                    Collection
                                </div>
                            </div>
                        </div>
                        <div class="description">
                            {{ collection.description }}
                        </div>
                        <div class="stat-bar">
                            <div class="stats">
                                <BoxIcon />
                                {{ collection.projects?.length || 0 }} projects
                            </div>
                            <div class="stats">
                                <template v-if="collection.status === 'listed'">
                                    <WorldIcon />
                                    <span> Public </span>
                                </template>
                                <template
                                    v-else-if="collection.status === 'unlisted'"
                                >
                                    <LinkIcon />
                                    <span> Unlisted </span>
                                </template>
                                <template
                                    v-else-if="collection.status === 'private'"
                                >
                                    <LockIcon />
                                    <span> Private </span>
                                </template>
                                <template
                                    v-else-if="collection.status === 'rejected'"
                                >
                                    <XIcon />
                                    <span> Rejected </span>
                                </template>
                            </div>
                        </div>
                    </nuxt-link>
                </div> -->
                <div
                    v-if="
                        route.params.projectType === 'collections' &&
                        collections.length === 0
                    "
                    class="error"
                >
                    <!-- <UpToDate class="icon" /><br /> -->
                    <span
                        v-if="auth.user && auth.user.id === user.id"
                        class="preserve-lines text"
                    >
                        <!-- <IntlFormatted
                            :message-id="messages.profileNoCollectionsAuthLabel"
                        >
                            <template #create-link="{ children }">
                                <a
                                    class="link"
                                    @click.prevent="
                                        (event) =>
                                            $refs.modal_collection_creation.show(
                                                event,
                                            )
                                    "
                                >
                                    <component :is="() => children" />
                                </a>
                            </template>
                        </IntlFormatted> -->
                    </span>
                    <span v-else class="text"
                        >This user has no collections!</span
                    >
                </div>
            </div>
            <div class="normal-page__sidebar">
                <!-- <div v-if="organizations.length > 0" class="card flex-card">
                    <h2 class="text-lg text-contrast">Organizations</h2>
                    <div class="flex flex-wrap gap-2">
                        <nuxt-link
                            v-for="org in organizations"
                            :key="org.id"
                            v-tooltip="org.name"
                            class="organization"
                            :to="`/organization/${org.slug}`"
                        >
                            <Avatar
                                :src="org.icon_url"
                                :alt="'Icon for ' + org.name"
                                size="3rem"
                            />
                        </nuxt-link>
                    </div>
                </div> -->
                <!-- <div v-if="badges.length > 0" class="card flex-card">
                    <h2 class="text-lg text-contrast">Badges</h2>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="badge in badges" :key="badge">
                            <StaffBadge
                                v-if="badge === 'staff'"
                                class="h-14 w-14"
                            />
                            <ModBadge
                                v-else-if="badge === 'mod'"
                                class="h-14 w-14"
                            />
                            <nuxt-link v-else-if="badge === 'plus'" to="/plus">
                                <PlusBadge class="h-14 w-14" />
                            </nuxt-link>
                            <TenMClubBadge
                                v-else-if="badge === '10m-club'"
                                class="h-14 w-14"
                            />
                            <EarlyAdopterBadge
                                v-else-if="badge === 'early-adopter'"
                                class="h-14 w-14"
                            />
                            <AlphaTesterBadge
                                v-else-if="badge === 'alpha-tester'"
                                class="h-14 w-14"
                            />
                            <BetaTesterBadge
                                v-else-if="badge === 'beta-tester'"
                                class="h-14 w-14"
                            />
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import {
    IconBooks,
    IconEdit,
    IconBox,
    IconLock,
    IconX,
    IconInfoCircle,
    IconCalendar,
    IconCopy,
    IconDotsVertical,
    IconCurrencyDollar,
    IconCheck,
    IconFlag
} from "@tabler/icons-vue";
import OverflowMenu from "~/components/modrinth/ui/base/OverflowMenu.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import ContentPageHeader from "~/components/modrinth/ui/base/ContentPageHeader.vue";
import NewModal from "~/components/modrinth/ui/modal/NewModal.vue";
import { isStaff }  from "~/helpers/users.js";
import NavTabs from "~/components/ui/NavTabs.vue";
import ProjectCard from "~/components/ui/ProjectCard.vue";
import { reportUser } from "~/utils/report-helpers.ts";

// import StaffBadge from "~/assets/images/badges/staff.svg?component";
// import ModBadge from "~/assets/images/badges/mod.svg?component";
// import PlusBadge from "~/assets/images/badges/plus.svg?component";
// import TenMClubBadge from "~/assets/images/badges/10m-club.svg?component";
// import EarlyAdopterBadge from "~/assets/images/badges/early-adopter.svg?component";
// import AlphaTesterBadge from "~/assets/images/badges/alpha-tester.svg?component";
// import BetaTesterBadge from "~/assets/images/badges/beta-tester.svg?component";

// import ReportIcon from "~/assets/images/utils/report.svg?component";
// import UpToDate from "~/assets/images/illustrations/up_to_date.svg?component";
// import EditIcon from "~/assets/images/utils/edit.svg?component";
// import WorldIcon from "~/assets/images/utils/world.svg?component";
import ModalCreation from "~/components/ui/ModalCreation.vue";
import Avatar from "~/components/ui/Avatar.vue";
import CollectionCreateModal from "~/components/ui/CollectionCreateModal.vue";

const data = useNuxtApp();
const route = useNativeRoute();
const auth = await useAuth();
const cosmetics = useCosmetics();
const tags = useTags();
const flags = useFeatureFlags();


const formatRelativeTime = useRelativeTime();


let user, projects, organizations, collections;
try {
    [
        { data: user },
        { data: projects },
        // { data: organizations },
        //{ data: collections },
    ] = await Promise.all([
        useAsyncData(`user/${route.params.id}`, () =>
            useBaseFetch(`user/${route.params.id}`),
        ),
        useAsyncData(
            `user/${route.params.id}/projects`,
            () => useBaseFetch(`user/${route.params.id}/projects`),
            {
                transform: (projects) => {
                    for (const project of projects) {
                        project.categories = project.categories.concat(
                            project.loaders,
                        );
                        project.project_type = data.$getProjectTypeForUrl(
                            project.project_type,
                            project.categories,
                            tags.value,
                        );
                    }

                    return projects;
                },
            },
        ),
        // useAsyncData(`user/${route.params.id}/organizations`, () =>
        //     useBaseFetch(`user/${route.params.id}/organizations`, {
        //         apiVersion: 3,
        //     }),
        // ),
        // useAsyncData(`user/${route.params.id}/collections`, () =>
        //     useBaseFetch(`user/${route.params.id}/collections`, {
        //         apiVersion: 3,
        //     }),
        // ),
    ]);
} catch {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "User not found",
    });
}

if (!user.value) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: "User not found",
    });
}

if (user.value.username !== route.params.id) {
    await navigateTo(`/user/${user.value.username}`, { redirectCode: 301 });
}

const title = computed(() => `${user.value.username} - Vanilla Tyme`);
const description = computed(() =>
    user.value.bio
        ? `${user.value.bio} - View ${user.value.username}'s shops on Vanilla Tyme'`
        : `View ${user.value.username}'s shops on Vanilla Tyme`,
);

useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () =>
        user.value.avatar_url ?? "https://cdn.modrinth.com/placeholder.png",
});

const projectTypes = computed(() => {
    const obj = {};

    if (collections.value.length > 0) {
        obj.collection = true;
    }

    for (const project of projects.value) {
        obj[project.project_type] = true;
    }

    delete obj.project;

    return Object.keys(obj);
});
const sumDownloads = computed(() => {
    let sum = 0;

    for (const project of projects.value) {
        sum += project.downloads;
    }

    return sum;
});

const joinDate = computed(() => new Date(user.value.created));
const MODRINTH_BETA_END_DATE = new Date("2022-02-27T08:00:00.000Z");
const MODRINTH_ALPHA_END_DATE = new Date("2020-11-30T08:00:00.000Z");

const badges = computed(() => {
    const badges = [];

    if (user.value.role === "admin") {
        badges.push("staff");
    }

    if (user.value.role === "moderator") {
        badges.push("mod");
    }

    if (isPermission(user.value.badges, 1 << 0)) {
        badges.push("plus");
    }

    if (sumDownloads.value > 10000000) {
        badges.push("10m-club");
    }

    if (
        isPermission(user.value.badges, 1 << 1) ||
        isPermission(user.value.badges, 1 << 2) ||
        isPermission(user.value.badges, 1 << 3)
    ) {
        badges.push("early-adopter");
    }

    if (
        isPermission(user.value.badges, 1 << 4) ||
        joinDate.value < MODRINTH_ALPHA_END_DATE
    ) {
        badges.push("alpha-tester");
    } else if (
        isPermission(user.value.badges, 1 << 4) ||
        joinDate.value < MODRINTH_BETA_END_DATE
    ) {
        badges.push("beta-tester");
    }

    if (isPermission(user.value.badges, 1 << 5)) {
        badges.push("contributor");
    }

    if (isPermission(user.value.badges, 1 << 6)) {
        badges.push("translator");
    }

    return badges;
});

async function copyId() {
    await navigator.clipboard.writeText(user.value.id);
}

const navLinks = computed(() => [
    {
        label: "All",
        href: `/user/${user.value.username}`,
    },
    // ...projectTypes.value
    //     .map((x) => {
    //         return {
    //             label: formatMessage(getProjectTypeMessage(x, true)),
    //             href: `/user/${user.value.username}/${x}s`,
    //         };
    //     })
    //     .slice()
    //     .sort((a, b) => a.label.localeCompare(b.label)),
]);
</script>
<script>
export default defineNuxtComponent({
    methods: {},
});
</script>

<style lang="scss" scoped>
.collections-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    @media screen and (max-width: 800px) {
        grid-template-columns: repeat(1, 1fr);
    }

    gap: var(--gap-lg);

    .collection-item {
        display: flex;
        flex-direction: column;
        gap: var(--gap-md);
    }

    .description {
        // Grow to take up remaining space
        flex-grow: 1;

        color: var(--color-text);
        font-size: 16px;
    }

    .stat-bar {
        display: flex;
        align-items: center;
        gap: var(--gap-md);
        margin-top: auto;
    }

    .stats {
        display: flex;
        align-items: center;
        gap: var(--gap-xs);

        svg {
            color: var(--color-secondary);
        }
    }

    .collection {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--gap-md);

        .icon {
            width: 100% !important;
            height: 6rem !important;
            max-width: unset !important;
            max-height: unset !important;
            aspect-ratio: 1 / 1;
            object-fit: cover;
        }

        .details {
            display: flex;
            flex-direction: column;
            gap: var(--gap-sm);

            .title {
                color: var(--color-contrast);
                font-weight: 600;
                font-size: var(--font-size-lg);
                margin: 0;
            }
        }
    }
}
</style>
