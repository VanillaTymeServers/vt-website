<template>
    <div class="pointer-events-none fixed inset-0 z-[-1]">
        <div id="fixed-background-teleport" class="relative"></div>
    </div>
    <div class="pointer-events-none absolute inset-0 z-[-1]">
        <div id="absolute-background-teleport" class="relative"></div>
    </div>
    <div
        ref="main_page"
        class="layout"
        :class="{ 'expanded-mobile-nav': isBrowseMenuOpen }"
    >
        <header
            class="experimental-styles-within desktop-only relative z-[5] mx-auto grid max-w-[1280px] grid-cols-[1fr_auto] items-center gap-2 px-6 py-4 lg:grid-cols-[auto_1fr_auto]"
        >
            <div>
                <NuxtLink to="/" aria-label="Vanilla Tyme home page">
                    <BrandTextLogo
                        aria-hidden="true"
                        class="h-7 w-auto text-contrast"
                    />
                </NuxtLink>
            </div>
            <div
                :class="`col-span-2 row-start-2 flex flex-wrap justify-center ${
                    flags.projectTypesPrimaryNav ? 'gap-2' : 'gap-4'
                } lg:col-span-1 lg:row-start-auto`"
            >
                <template v-if="flags.projectTypesPrimaryNav">
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name === 'search-mods' ||
                            route.path.startsWith('/mod/')
                        "
                        :highlighted-style="
                            route.name === 'search-mods'
                                ? 'main-nav-primary'
                                : 'main-nav-secondary'
                        "
                    >
                        <nuxt-link to="/mods">
                            <IconBox aria-hidden="true" /> Mods
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name === 'search-resourcepacks' ||
                            route.path.startsWith('/resourcepack/')
                        "
                        :highlighted-style="
                            route.name === 'search-resourcepacks'
                                ? 'main-nav-primary'
                                : 'main-nav-secondary'
                        "
                    >
                        <nuxt-link to="/resourcepacks">
                            <IconBrush aria-hidden="true" /> Resource Packs
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name === 'search-datapacks' ||
                            route.path.startsWith('/datapack/')
                        "
                        :highlighted-style="
                            route.name === 'search-datapacks'
                                ? 'main-nav-primary'
                                : 'main-nav-secondary'
                        "
                    >
                        <nuxt-link to="/datapacks">
                            <IconBraces aria-hidden="true" /> Data Packs
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name === 'search-modpacks' ||
                            route.path.startsWith('/modpack/')
                        "
                        :highlighted-style="
                            route.name === 'search-modpacks'
                                ? 'main-nav-primary'
                                : 'main-nav-secondary'
                        "
                    >
                        <nuxt-link to="/modpacks">
                            <IconPackage aria-hidden="true" /> Modpacks
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name === 'search-shaders' ||
                            route.path.startsWith('/shader/')
                        "
                        :highlighted-style="
                            route.name === 'search-shaders'
                                ? 'main-nav-primary'
                                : 'main-nav-secondary'
                        "
                    >
                        <nuxt-link to="/shaders">
                            <IconEyeglass2 aria-hidden="true" /> Shaders
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name === 'search-plugins' ||
                            route.path.startsWith('/plugin/')
                        "
                        :highlighted-style="
                            route.name === 'search-plugins'
                                ? 'main-nav-primary'
                                : 'main-nav-secondary'
                        "
                    >
                        <nuxt-link to="/plugins">
                            <IconPlug aria-hidden="true" /> Plugins
                        </nuxt-link>
                    </ButtonStyled>
                </template>
                <template v-else>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="
                            route.name?.startsWith('search-')
                        "
                        :highlighted-style="
                            route.name?.startsWith('search-')
                                ? 'main-nav-secondary'
                                : 'main-nav-primary'
                        "
                    >
                        <nuxt-link to="/shops">
                            <IconBuildingStore aria-hidden="true" />
                            Shops
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled
                        type="transparent"
                        :highlighted="isDiscovering || isDiscoveringSubPage"
                        :highlighted-style="
                            isDiscoveringSubPage
                                ? 'main-nav-secondary'
                                : 'main-nav-primary'
                        "
                    >
                        <TeleportOverflowMenu
                            :options="[
                                {
                                    id: 'rules',
                                    action: '/rules',
                                },
                                {
                                    id: 'vote',
                                    action: '/vote',
                                },
                                {
                                    id: 'maps',
                                    action: '/map-downloads',
                                },
                            ]"
                            hoverable
                        >
                            <IconCompass aria-hidden="true" />
                            <span class="hidden md:contents">Rules & more</span>
                            <span class="contents md:hidden">Rules +</span>
                            <IconChevronDown
                                aria-hidden="true"
                                class="h-5 w-5 text-secondary"
                            />

                            <template #rules>
                                <IconGavel aria-hidden="true" /> Rules
                            </template>
                            <template #vote>
                                <VoteIcon aria-hidden="true" /> Vote
                            </template>
                            <template #maps>
                                <IconMapDown aria-hidden="true" /> Map downloads
                            </template>
                        </TeleportOverflowMenu>
                    </ButtonStyled>

                    <ButtonStyled
                        type="transparent"
                    >
                        <nuxt-link to="https://store.vanillatymeservers.com" target="_blank" external>
                            <IconServer aria-hidden="true" />
                            Store
                        </nuxt-link>
                    </ButtonStyled>
                    <!-- <ButtonStyled
                        type="transparent"
                        :highlighted="route.name === 'app'"
                    >
                        <nuxt-link to="/app">
                            <IconDownload aria-hidden="true" />
                            <span class="hidden md:contents"
                                >Get Modrinth App</span
                            >
                            <span class="contents md:hidden">Modrinth App</span>
                        </nuxt-link>
                    </ButtonStyled> -->
                </template>
            </div>
            <div class="flex items-center gap-2">
                <ButtonStyled type="transparent">
                    <OverflowMenu
                        v-if="auth.user"
                        class="btn-dropdown-animation flex items-center gap-1 rounded-xl bg-transparent px-2 py-1"
                        position="bottom"
                        direction="left"
                        :dropdown-id="createPopoutId"
                        aria-label="Create new..."
                        :options="[
                            {
                                id: 'new-project',
                                action: (event) =>
                                    $refs.modal_creation.show(event),
                            },
                            {
                                id: 'new-collection',
                                action: (event) =>
                                    $refs.modal_collection_creation.show(event),
                            },
                            { divider: true },
                            {
                                id: 'new-organization',
                                action: (event) =>
                                    $refs.modal_organization_creation.show(
                                        event,
                                    ),
                            },
                        ]"
                    >
                        <IconPlus aria-hidden="true" />
                        <IconChevronDown
                            aria-hidden="true"
                            class="h-5 w-5 text-secondary"
                        />
                        <template #new-project>
                            <IconBox aria-hidden="true" /> New project
                        </template>
                        <!-- <template #import-project> <BoxImportIcon /> Import project </template>-->
                        <template #new-collection>
                            <IconBooks aria-hidden="true" /> New collection
                        </template>
                        <template #new-organization>
                            <IconBuilding aria-hidden="true" /> New organization
                        </template>
                    </OverflowMenu>
                </ButtonStyled>
                <OverflowMenu
                    v-if="auth.user"
                    :dropdown-id="userPopoutId"
                    class="btn-dropdown-animation flex items-center gap-1 rounded-xl bg-transparent px-2 py-1"
                    :options="userMenuOptions"
                >
                    <Avatar
                        :src="auth.user.avatar_url"
                        aria-hidden="true"
                        circle
                    />
                    <IconChevronDown class="h-5 w-5 text-secondary" />
                    <template #profile>
                        <IconUser aria-hidden="true" /> Profile
                    </template>
                    <template #notifications>
                        <IconBell aria-hidden="true" /> Notifications
                    </template>
                    <template #saved>
                        <IconBookmark aria-hidden="true" /> Saved projects
                    </template>
                    <template #servers>
                        <IconServer aria-hidden="true" /> My servers
                    </template>
                    <template #plus>
                        <IconArrowBigUpLine aria-hidden="true" /> Upgrade to
                        Modrinth+
                    </template>
                    <template #settings>
                        <IconSettings aria-hidden="true" /> Settings
                    </template>
                    <template #flags>
                        <IconExclamationCircle aria-hidden="true" /> Feature
                        flags
                    </template>
                    <template #shops>
                        <IconBox aria-hidden="true" /> Shops
                    </template>
                    <template #organizations>
                        <IconBuilding aria-hidden="true" /> Organizations
                    </template>
                    <template #revenue>
                        <IconCurrencyDollar aria-hidden="true" /> Revenue
                    </template>
                    <template #analytics>
                        <IconChartHistogram aria-hidden="true" /> Analytics
                    </template>
                    <template #moderation>
                        <IconScale aria-hidden="true" /> Moderation
                    </template>
                    <template #sign-out>
                        <IconLogout aria-hidden="true" /> Sign out
                    </template>
                </OverflowMenu>
                <template v-else>
                    <ButtonStyled color="brand">
                        <nuxt-link to="/auth/sign-in">
                            <IconLogin2 aria-hidden="true" />
                            Sign in
                        </nuxt-link>
                    </ButtonStyled>
                    <ButtonStyled circular>
                        <nuxt-link v-tooltip="Settings" to="/settings">
                            <IconSettings aria-label="Settings" />
                        </nuxt-link>
                    </ButtonStyled>
                </template>
            </div>
        </header>
        <header class="mobile-navigation mobile-only">
            <div
                class="nav-menu nav-menu-browse"
                :class="{ expanded: isBrowseMenuOpen }"
                @focusin="isBrowseMenuOpen = true"
                @focusout="isBrowseMenuOpen = false"
            >
                <div class="links cascade-links">
                    <NuxtLink
                        v-for="navRoute in navRoutes"
                        :key="navRoute.href"
                        :to="navRoute.href"
                        class="iconified-button"
                    >
                        {{ navRoute.label }}
                    </NuxtLink>
                </div>
            </div>
            <div
                class="nav-menu nav-menu-mobile"
                :class="{ expanded: isMobileMenuOpen }"
                @focusin="isMobileMenuOpen = true"
                @focusout="isMobileMenuOpen = false"
            >
                <div class="account-container">
                    <NuxtLink
                        v-if="auth.user"
                        :to="`/user/${auth.user.username}`"
                        class="iconified-button account-button"
                    >
                        <Avatar
                            :src="auth.user.avatar_url"
                            class="user-icon"
                            alt="Your avatar"
                            aria-hidden="true"
                            circle
                        />
                        <div class="account-text">
                            <div>@{{ auth.user.username }}</div>
                            <div>Visit your profile</div>
                        </div>
                    </NuxtLink>
                    <nuxt-link
                        v-else
                        class="iconified-button brand-button"
                        to="/auth/sign-in"
                    >
                        <IconLogin2 aria-hidden="true" /> Sign in
                    </nuxt-link>
                </div>
                <div class="links">
                    <template v-if="auth.user">
                        <button
                            class="iconified-button danger-button"
                            @click="logoutUser()"
                        >
                            <IconLogout aria-hidden="true" />
                            Sign out
                        </button>
                        <button
                            class="iconified-button"
                            @click="$refs.modal_creation.show()"
                        >
                            <IconPlus aria-hidden="true" />
                            Create a shop
                        </button>
                        <NuxtLink
                            class="iconified-button"
                            to="/dashboard/collections"
                        >
                            <IconBooks class="icon" />
                            Collections
                        </NuxtLink>
                        <NuxtLink class="iconified-button" to="/servers/manage">
                            <IconServer class="icon" />
                            Servers
                        </NuxtLink>
                        <NuxtLink
                            v-if="
                                auth.user.role === 'moderator' ||
                                auth.user.role === 'admin'
                            "
                            class="iconified-button"
                            to="/moderation"
                        >
                            <IconScale aria-hidden="true" />
                            Moderation
                        </NuxtLink>
                        <NuxtLink
                            v-if="flags.developerMode"
                            class="iconified-button"
                            to="/flags"
                        >
                            <IconExclamationCircle aria-hidden="true" />
                            Feature flags
                        </NuxtLink>
                    </template>
                    <NuxtLink class="iconified-button" to="/settings">
                        <IconSettings aria-hidden="true" />
                        Settings
                    </NuxtLink>
                    <button class="iconified-button" @click="changeTheme">
                        <IconMoon
                            v-if="$theme.active === 'light'"
                            class="icon"
                        />
                        <IconSun v-else class="icon" />
                        <span class="dropdown-item__text"> Change theme </span>
                    </button>
                </div>
            </div>
            <div
                class="mobile-navbar"
                :class="{ expanded: isBrowseMenuOpen || isMobileMenuOpen }"
            >
                <NuxtLink
                    to="/"
                    class="tab button-animation"
                    title="Home"
                    aria-label="Home"
                >
                    <IconHome aria-hidden="true" />
                </NuxtLink>
                <NuxtLink
                    to="/shops"
                    class="tab button-animation"
                    title="Shops"
                    aria-label="Shops"
                >
                    <IconBuildingStore aria-hidden="true" />
                </NuxtLink>
                <button
                    class="tab button-animation"
                    :class="{ 'router-link-exact-active': isBrowseMenuOpen }"
                    title="Search"
                    aria-label="Search"
                    @click="toggleBrowseMenu()"
                >
                    <template v-if="auth.user">
                        <IconDots aria-hidden="true" />
                    </template>
                    <template v-else>
                        <IconDotsVertical aria-hidden="true" class="smaller" />
                        More
                    </template>
                </button>
                <template v-if="auth.user">
                    <NuxtLink
                        to="/dashboard/notifications"
                        class="tab button-animation"
                        aria-label="Notifications"
                        :class="{
                            'no-active': isMobileMenuOpen || isBrowseMenuOpen,
                        }"
                        title="Notifications"
                        @click="
                            () => {
                                isMobileMenuOpen = false;
                                isBrowseMenuOpen = false;
                            }
                        "
                    >
                        <IconBell aria-hidden="true" />
                    </NuxtLink>
                    <NuxtLink
                        to="/dashboard"
                        class="tab button-animation"
                        aria-label="Dashboard"
                        title="Dashboard"
                    >
                        <IconDashboard aria-hidden="true" />
                    </NuxtLink>
                </template>
                <button
                    class="tab button-animation"
                    title="Toggle menu"
                    :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
                    @click="toggleMobileMenu()"
                >
                    <template v-if="!auth.user">
                        <IconMenu2
                            v-if="!isMobileMenuOpen"
                            aria-hidden="true"
                        />
                        <IconX v-else aria-hidden="true" />
                    </template>
                    <template v-else>
                        <Avatar
                            :src="auth.user.avatar_url"
                            class="user-icon"
                            :class="{ expanded: isMobileMenuOpen }"
                            alt="Your avatar"
                            aria-hidden="true"
                            circle
                        />
                    </template>
                </button>
            </div>
        </header>
        <main>
            <ModalCreation v-if="auth.user" ref="modal_creation" />
            <CollectionCreateModal ref="modal_collection_creation" />
            <OrganizationCreateModal ref="modal_organization_creation" />
            <slot id="main" />
        </main>
        <footer
            class="footer-brand-background experimental-styles-within mt-6 border-0 border-t-[1px] border-solid"
        >
            <div
                class="mx-auto flex max-w-screen-xl flex-col gap-6 p-6 pb-12 sm:px-12 md:py-12"
            >
                <div
                    class="grid grid-cols-1 gap-4 text-primary md:grid-cols-[1fr_2fr] lg:grid-cols-[auto_auto_auto_auto_auto]"
                >
                    <div
                        class="flex flex-col items-center gap-3 md:items-start"
                        role="region"
                        aria-label="Vanilla Tyme information"
                    >
                        <BrandTextLogo
                            aria-hidden="true"
                            class="text-logo button-base h-6 w-auto text-contrast lg:h-8"
                            @click="developerModeIncrement()"
                        />
                        <div
                            class="flex flex-wrap justify-center gap-px sm:-mx-2"
                        >
                            <ButtonStyled
                                v-for="(social, index) in socialLinks"
                                :key="`footer-social-${index}`"
                                circular
                                type="transparent"
                            >
                                <a
                                    v-tooltip="social.label"
                                    :href="social.href"
                                    target="_blank"
                                    :rel="`noopener${social.rel ? ` ${social.rel}` : ''}`"
                                >
                                    <component
                                        :is="social.icon"
                                        class="h-5 w-5"
                                    />
                                </a>
                            </ButtonStyled>
                        </div>
                        <div
                            class="mt-auto flex flex-wrap justify-center gap-3 md:flex-col"
                        >
                            <p class="m-0">
                                Website is
                                <a
                                    href="https://github.com/VanillaTymeServers/website"
                                    class="text-brand hover:underline"
                                    target="_blank"
                                    rel="noopener"
                                    >open source</a
                                >.
                            </p>
                            <p class="m-0">© 2026 Vanilla Tyme.</p>
                        </div>
                    </div>
                    <div
                        class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:contents"
                    >
                        <div
                            v-for="group in footerLinks"
                            :key="group.label"
                            class="flex flex-col items-center gap-3 sm:items-start"
                        >
                            <h3 class="m-0 text-base text-contrast">
                                {{ group.label }}
                            </h3>
                            <template
                                v-for="item in group.links"
                                :key="item.label"
                            >
                                <nuxt-link
                                    v-if="item.href.startsWith('/')"
                                    :to="item.href"
                                    class="w-fit hover:underline"
                                >
                                    {{ item.label }}
                                </nuxt-link>
                                <a
                                    v-else
                                    :href="item.href"
                                    class="w-fit hover:underline"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    {{ item.label }}
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
                <div>
                    <span
                        class="flex justify-center text-center text-xs font-medium text-secondary opacity-50"
                    >
                        Based on original work © 2020-2026 Rinth, Inc.,
                        licensed under AGPL v3.
                    </span>
                    <span
                        class="flex justify-center text-center text-xs font-medium text-secondary opacity-50"
                    >
                        NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR
                        ASSOCIATED WITH MOJANG OR MICROSOFT.
                    </span>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import {
    IconArrowBigUpLine,
    IconBell,
    IconBookmark,
    IconBooks,
    IconBox,
    IconBraces,
    IconBrush,
    IconBuilding,
    IconBuildingStore,
    IconChartHistogram,
    IconChevronDown,
    IconCompass,
    IconCross,
    IconCurrencyDollar,
    IconDashboard,
    IconDots,
    IconDotsVertical,
    IconDownload,
    IconExclamationCircle,
    IconEyeglass2,
    IconGavel,
    IconHome,
    IconLogin2,
    IconLogout,
    IconMapDown,
    IconMenu,
    IconMenu2,
    IconMoon,
    IconPackage,
    IconPlug,
    IconPlus,
    IconScale,
    IconSearch,
    IconServer,
    IconSettings,
    IconSun,
    IconUser,
    IconX,
} from "@tabler/icons-vue";
import BrandTextLogo from "~/components/brand/TextLogo.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import TeleportOverflowMenu from "~/components/ui/servers/TeleportOverflowMenu.vue";
import ModalCreation from "~/components/ui/ModalCreation.vue";
import CollectionCreateModal from "~/components/ui/CollectionCreateModal.vue";
import OrganizationCreateModal from "~/components/ui/OrganizationCreateModal.vue";
import OverflowMenu from "~/components/modrinth/ui/base/OverflowMenu.vue";
import Avatar from "~/components/modrinth/ui/base/Avatar.vue";
import DiscordIcon from "~/assets/icons/discord.svg?component";
import GithubIcon from "~/assets/icons/github.svg?component";
import RedditIcon from "~/assets/icons/reddit.svg?component";
import { VoteIcon } from "lucide-vue-next";

const app = useNuxtApp();
const auth = await useAuth();
const user = await useUser();

const cosmetics = useCosmetics();
const flags = useFeatureFlags();

const config = useRuntimeConfig();
const route = useNativeRoute();
const link = config.public.siteUrl + route.path.replace(/\/+$/, "");

const createPopoutId = useId();
const userPopoutId = useId();

useHead({
    link: [
        {
            rel: "canonical",
            href: link,
        },
    ],
});
useSeoMeta({
    title: "Vanilla Tyme",
    description:
        "Vanilla Tyme SMP is a Minecraft server that is focused on providing a vanilla experience with a few quality of life plugins.",
    publisher: "Vanilla Tyme",
    themeColor: "#1bd96a",
    colorScheme: "dark light",

    // OpenGraph
    ogTitle: "Vanilla Tyme",
    ogSiteName: "Vanilla Tyme",
    ogDescription:
        "Vanilla Tyme SMP is a Minecraft server that is focused on providing a vanilla experience with a few quality of life plugins.",
    ogType: "website",
    ogImage: "https://cdn.modrinth.com/modrinth-new.png",
    ogUrl: link,

    // Twitter
    twitterCard: "summary",
    twitterSite: "@VanillaTyme",
});
console.log(route.name+ ' ' +  JSON.stringify(route.query));
const developerModeCounter = ref(0);

const isMobileMenuOpen = ref(false);
const isBrowseMenuOpen = ref(false);
const navRoutes = computed(() => [
    {
        id: "rules",
        label: "Rules",
        href: "/rules",
    },
    {
        label: "Vote",
        href: "/vote",
    },
    {
        label: "Map downloads",
        href: "/map-downloads",
    },
]);

const userMenuOptions = computed(() => {
    let options = [
        {
            id: "profile",
            link: `/user/${auth.value.user.username}`,
        },
        {
            id: "plus",
            link: "/plus",
            color: "purple",
            shown:
                !flags.value.hidePlusPromoInUserMenu &&
                !isPermission(auth.value.user.badges, 1 << 0),
        },
        {
            id: "notifications",
            link: "/dashboard/notifications",
        },
        {
            id: "saved",
            link: "/dashboard/collections",
        },
        {
            id: "servers",
            link: "/servers/manage",
        },
        {
            id: "flags",
            link: "/flags",
            shown: flags.value.developerMode,
        },
        {
            id: "settings",
            link: "/settings",
        },
    ];

    // TODO: Only show if user has projects
    options = [
        ...options,
        {
            divider: true,
        },
        {
            id: "shops",
            link: "/dashboard/shops",
        },
        {
            id: "organizations",
            link: "/dashboard/organizations",
        },
        {
            id: "revenue",
            link: "/dashboard/revenue",
        },
        {
            id: "analytics",
            link: "/dashboard/analytics",
        },
    ];

    if (
        (auth.value &&
            auth.value.user &&
            auth.value.user.role === "moderator") ||
        auth.value.user.role === "admin"
    ) {
        options = [
            ...options,
            {
                divider: true,
            },
            {
                id: "moderation",
                color: "orange",
                link: "/moderation/review",
            },
        ];
    }

    options = [
        ...options,
        {
            divider: true,
        },
        {
            id: "sign-out",
            color: "danger",
            action: () => logoutUser(),
            hoverFilled: true,
        },
    ];
    return options;
});

const isDiscovering = computed(
    () => route.name && route.name.startsWith("search-") && route.query.sid,
);

const isDiscoveringSubPage = computed(
    () => route.name && route.name.startsWith("type-id") && !route.query.sid,
);

onMounted(() => {
    if (window && import.meta.client) {
        window.history.scrollRestoration = "auto";
    }

    runAnalytics();
});

watch(
    () => route.path,
    () => {
        isMobileMenuOpen.value = false;
        isBrowseMenuOpen.value = false;

        if (import.meta.client) {
            document.body.style.overflowY = "scroll";
            document.body.setAttribute("tabindex", "-1");
            document.body.removeAttribute("tabindex");
        }

        updateCurrentDate();
        runAnalytics();
    },
);

function developerModeIncrement() {
    if (developerModeCounter.value >= 5) {
        flags.value.developerMode = !flags.value.developerMode;
        developerModeCounter.value = 0;
        saveFeatureFlags();
        if (flags.value.developerMode) {
            app.$notify({
                group: "main",
                title: "Developer mode activated",
                text: "Developer mode has been enabled",
                type: "success",
            });
        } else {
            app.$notify({
                group: "main",
                title: "Developer mode deactivated",
                text: "Developer mode has been disabled",
                type: "success",
            });
        }
    } else {
        developerModeCounter.value++;
    }
}

async function logoutUser() {
    await logout();
}

function runAnalytics() {
    const config = useRuntimeConfig();
    const replacedUrl = config.public.apiBaseUrl.replace("v2/", "");

    try {
        setTimeout(() => {
            $fetch(`${replacedUrl}analytics/view`, {
                method: "POST",
                body: {
                    url: window.location.href,
                },
                headers: {
                    Authorization: auth.value.token,
                },
            })
                .then(() => {})
                .catch(() => {});
        });
    } catch (e) {
        console.error(
            `Sending analytics failed (CORS error? If so, ignore)`,
            e,
        );
    }
}
function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    if (isMobileMenuOpen.value) {
        isBrowseMenuOpen.value = false;
    }
}
function toggleBrowseMenu() {
    isBrowseMenuOpen.value = !isBrowseMenuOpen.value;

    if (isBrowseMenuOpen.value) {
        isMobileMenuOpen.value = false;
    }
}

const { cycle: changeTheme } = useTheme();

function hideStagingBanner() {
    cosmetics.value.hideStagingBanner = true;
}
const socialLinks = [
    {
        label: "Discord",
        href: "https://discord.vanillatymeservers.com",
        icon: DiscordIcon,
    },
    {
        label: "GitHub",
        href: "https://github.com/VanillaTymeServers",
        icon: GithubIcon,
    },
];
const footerLinks = [
    {
        label: "About",
        links: [
            {
                href: "/news",
                label: "News",
            },
            {
                href: "/news/changelog",
                label: "Changelog",
            },
            {
                href: "/rules",
                label: "Rules",
            },
        ],
    },
    {
        label: "Content",
        links: [
            {
                href: "/shops",
                label: "Shops",
            },
        ],
    },
    // {
    //     label: "Resources",
    //     links: [
    //         {
    //             href: "https://support.modrinth.com",
    //             label: "Help Center",
    //         },
    //         {
    //             href: "https://crowdin.com/project/modrinth",
    //             label: "Translate",
    //         },
    //         {
    //             href: "https://github.com/modrinth/code/issues",
    //             label: "Report issues",
    //         },
    //         {
    //             href: "https://docs.modrinth.com/api/",
    //             label: "API documentation",
    //         },
    //     ],
    // },
    // {
    //     label: "Legal",
    //     links: [
    //         {
    //             href: "/legal/rules",
    //             label: "Content Rules",
    //         },
    //         {
    //             href: "/legal/terms",
    //             label: "Terms of Use",
    //         },
    //         {
    //             href: "/legal/privacy",
    //             label: "Privacy Policy",
    //         },
    //         {
    //             href: "/legal/security",
    //             label: "Security Notice",
    //         },
    //     ],
    // },
];
</script>

<style lang="scss">
@import "~/assets/styles/global.scss";
// @import '@modrinth/assets';

.layout {
    min-height: 100vh;
    display: block;

    @media screen and (min-width: 1024px) {
        min-height: calc(100vh - var(--spacing-card-bg));
    }

    main {
        grid-area: main;
    }
}

@media (min-width: 1024px) {
    .layout {
        main {
            .alpha-alert {
                margin: 1rem;

                .wrapper {
                    padding: 1rem 2rem 1rem 1rem;
                }
            }
        }
    }
}

.email-nag {
    z-index: 6;
    position: relative;
    background-color: var(--color-raised-bg);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
}

.site-banner--warning {
    // On some pages, there's gradient backgrounds that seep underneath
    // the banner, so we need to add a solid color underlay.
    background-color: black;
    border-bottom: 2px solid var(--color-red);
    display: grid;
    gap: 0.5rem;
    grid-template: "title actions" "description actions";
    padding-block: var(--gap-xl);
    padding-inline: max(
        calc((100% - 80rem) / 2 + var(--gap-md)),
        var(--gap-xl)
    );
    z-index: 4;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-red-bg);
        z-index: 5;
    }

    .site-banner__title {
        grid-area: title;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        font-weight: bold;
        font-size: var(--font-size-md);
        color: var(--color-contrast);

        svg {
            color: var(--color-red);
            width: 1.5rem;
            height: 1.5rem;
            flex-shrink: 0;
        }
    }

    .site-banner__description {
        grid-area: description;
    }

    .site-banner__actions {
        grid-area: actions;
    }

    a {
        color: var(--color-red);
    }
}

@media (max-width: 1200px) {
    .app-btn {
        display: none;
    }
}

.mobile-navigation {
    display: none;

    .nav-menu {
        width: 100%;
        position: fixed;
        bottom: calc(
            var(--size-mobile-navbar-height) - var(--size-rounded-card)
        );
        padding-bottom: var(--size-rounded-card);
        left: 0;
        background-color: var(--color-raised-bg);
        z-index: 6;
        transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.54, 0.84, 0.42, 1);
        border-radius: var(--size-rounded-card) var(--size-rounded-card) 0 0;
        box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0);

        .links,
        .account-container {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            grid-gap: 1rem;
            justify-content: center;
            padding: 1rem;

            .iconified-button {
                width: 100%;
                max-width: 500px;
                padding: 0.75rem;
                justify-content: center;
                font-weight: 600;
                font-size: 1rem;
                margin: 0 auto;
            }
        }

        .cascade-links {
            @media screen and (min-width: 354px) {
                grid-template-columns: repeat(2, 1fr);
            }
            @media screen and (min-width: 674px) {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        &-browse {
            &.expanded {
                transform: translateY(0);
                box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
            }
        }

        &-mobile {
            .account-container {
                padding-bottom: 0;

                .account-button {
                    padding: var(--spacing-card-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;

                    .user-icon {
                        width: 2.25rem;
                        height: 2.25rem;
                    }

                    .account-text {
                        flex-grow: 0;
                    }
                }
            }

            &.expanded {
                transform: translateY(0);
                box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
            }
        }
    }

    .mobile-navbar {
        display: flex;
        height: calc(
            var(--size-mobile-navbar-height) + env(safe-area-inset-bottom)
        );
        border-radius: var(--size-rounded-card) var(--size-rounded-card) 0 0;
        padding-bottom: env(safe-area-inset-bottom);
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: var(--color-raised-bg);
        box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
        z-index: 7;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        transition: border-radius 0.3s ease-out;
        border-top: 2px solid rgba(0, 0, 0, 0);
        box-sizing: border-box;

        &.expanded {
            box-shadow: none;
            border-radius: 0;
        }

        .tab {
            position: relative;
            background: none;
            display: flex;
            flex-basis: 0;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            gap: 0.25rem;
            font-weight: bold;
            padding: 0;
            transition: color ease-in-out 0.15s;
            color: var(--color-text-inactive);
            text-align: center;

            &.browse {
                svg {
                    transform: rotate(180deg);
                    transition: transform ease-in-out 0.3s;

                    &.closed {
                        transform: rotate(0deg);
                    }
                }
            }

            &.bubble {
                &::after {
                    background-color: var(--color-brand);
                    border-radius: var(--size-rounded-max);
                    content: "";
                    height: 0.5rem;
                    position: absolute;
                    left: 1.5rem;
                    top: 0;
                    width: 0.5rem;
                }
            }

            svg {
                height: 1.75rem;
                width: 1.75rem;

                &.smaller {
                    width: 1.25rem;
                    height: 1.25rem;
                }
            }

            .user-icon {
                width: 2rem;
                height: 2rem;
                transition: border ease-in-out 0.15s;
                border: 0 solid var(--color-brand);
                box-sizing: border-box;

                &.expanded {
                    border: 2px solid var(--color-brand);
                }
            }

            &:hover,
            &:focus {
                color: var(--color-text);
            }

            &:first-child {
                margin-left: 2rem;
            }

            &:last-child {
                margin-right: 2rem;
            }

            &.router-link-exact-active:not(&.no-active) {
                svg {
                    color: var(--color-brand);
                }

                color: var(--color-brand);
            }
        }
    }
}

@media (any-hover: none) and (max-width: 640px) {
    .desktop-only {
        display: none;
    }
}

@media (any-hover: none) and (max-width: 640px) {
    .mobile-navigation {
        display: flex;
    }
}

.footer-brand-background {
    background: var(--brand-gradient-strong-bg);
    border-color: var(--brand-gradient-border);
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
