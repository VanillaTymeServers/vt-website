<template>
    <div>
        <MessageBanner
            v-if="flags.developerMode"
            message-type="warning"
            class="developer-message"
        >
            <IconCode class="inline-flex" />
            <strong>Developer mode</strong> is active. This will allow you to
            view the internal IDs of various things throughout Modrinth that may
            be helpful if you're a developer using the Modrinth API. Click on
            the Modrinth logo at the bottom of the page 5 times to toggle
            developer mode.
            <Button :action="() => disableDeveloperMode()"
                >Deactivate developer mode</Button
            >
        </MessageBanner>
        <section class="universal-card">
            <h2 class="text-2xl">Color theme</h2>
            <p>Select your preferred color theme for Vanilla Tyme on this device.</p>
            <ThemeSelector
                :update-color-theme="updateColorTheme"
                :current-theme="theme.preferred"
                :theme-options="themeOptions"
                :system-theme-color="systemTheme"
            />
        </section>
        <section class="universal-card">
            <h2 class="text-2xl">
                Project list layouts
            </h2>
            <p class="mb-4">
                Select your preferred layout for each page that displays project lists on this device.
            </p>
            <div class="project-lists">
                <div class='shop-list-layouts'>
                    <div class="label">
                        <div class="label__title">
                            Shops page
                        </div>
                    </div>
                    <div class="project-list-layouts">
                        <button
                            class="preview-radio button-base"
                            :class="{
                                selected:
                                    cosmetics.searchDisplayMode[
                                        'shop'
                                    ] === 'list',
                            }"
                            @click="
                                () =>
                                    (cosmetics.searchDisplayMode[
                                        'shop'
                                    ] = 'list')
                            "
                        >
                            <div class="preview">
                                <div class="layout-list-mode">
                                    <div class="example-card card"></div>
                                    <div class="example-card card"></div>
                                    <div class="example-card card"></div>
                                    <div class="example-card card"></div>
                                </div>
                            </div>
                            <div class="label">
                                <IconCircleDot
                                    v-if="
                                        cosmetics.searchDisplayMode[
                                            'shop'
                                        ] === 'list'
                                    "
                                    class="radio"
                                />
                                <IconCircle v-else class="radio" />
                                Rows
                            </div>
                        </button>
                        <button
                            class="preview-radio button-base"
                            :class="{
                                selected:
                                    cosmetics.searchDisplayMode[
                                        'shop'
                                    ] === 'grid',
                            }"
                            @click="
                                () =>
                                    (cosmetics.searchDisplayMode[
                                        'shop'
                                    ] = 'grid')
                            "
                        >
                            <div class="preview">
                                <div class="layout-gallery-mode">
                                    <div class="example-card card"></div>
                                    <div class="example-card card"></div>
                                    <div class="example-card card"></div>
                                    <div class="example-card card"></div>
                                </div>
                            </div>
                            <div class="label">
                                <IconCircleDot
                                    v-if="
                                        cosmetics.searchDisplayMode[
                                            'shop'
                                        ] === 'grid'
                                    "
                                    class="radio"
                                />
                                <IconCircle v-else class="radio" />
                                Grid
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <section class="universal-card">
            <h2 class="text-2xl">Toggle features</h2>
            <p class="mb-4">Enable or disable certain features on this device.</p>
            <div class="adjacent-input small">
                <label for="advanced-rendering">
                    <span class="label__title">
                        Advanced rendering
                    </span>
                    <span class="label__description">
                        Enables advanced rendering such as blur effects that may cause performance issues without hardware-accelerated rendering.
                    </span>
                </label>
                <input
                    id="advanced-rendering"
                    v-model="cosmetics.advancedRendering"
                    class="switch stylized-toggle"
                    type="checkbox"
                />
            </div>
            <div class="adjacent-input small">
                <label for="external-links-new-tab">
                    <span class="label__title">
                        Open external links in new tab
                    </span>
                    <span class="label__description">
                        Make links which go outside of Modrinth open in a new tab. No matter this setting, links on the same domain and in Markdown descriptions will open in the same tab, and links on ads and edit pages will open in a new tab.
                    </span>
                </label>
                <input
                    id="external-links-new-tab"
                    v-model="cosmetics.externalLinksNewTab"
                    class="switch stylized-toggle"
                    type="checkbox"
                />
            </div>
            <div v-if="false" class="adjacent-input small">
                <label for="modrinth-app-promos">
                    <span class="label__title">
                        Hide Modrinth App promotions
                    </span>
                    <span class="label__description">
                        Hides the "Get Modrinth App" buttons from primary navigation. The Modrinth App page can still be found on the landing page or in the footer.
                    </span>
                </label>
                <input
                    id="modrinth-app-promos"
                    v-model="cosmetics.hideModrinthAppPromos"
                    class="switch stylized-toggle"
                    type="checkbox"
                />
            </div>
            <div class="adjacent-input small">
                <label for="search-layout-toggle">
                    <span class="label__title">
                        Right-aligned filters sidebar on search pages
                    </span>
                    <span class="label__description">
                        Aligns the filters sidebar to the right of the search results.
                    </span>
                </label>
                <input
                    id="search-layout-toggle"
                    v-model="cosmetics.rightSearchLayout"
                    class="switch stylized-toggle"
                    type="checkbox"
                />
            </div>
            <div class="adjacent-input small">
                <label for="project-layout-toggle">
                    <span class="label__title">
                        Left-aligned sidebar on content pages
                    </span>
                    <span class="label__description">
                        Aligns the sidebar to the left of the page's content.
                    </span>
                </label>
                <input
                    id="project-layout-toggle"
                    v-model="cosmetics.leftContentLayout"
                    class="switch stylized-toggle"
                    type="checkbox"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { IconCode, IconCircle, IconCircleDot } from "@tabler/icons-vue";
import Button from "~/components/modrinth/ui/base/Button.vue";
import ThemeSelector from "~/components/modrinth/ui/settings/ThemeSelector.vue";
import MessageBanner from "~/components/ui/MessageBanner.vue";
import type { DisplayLocation } from "~/plugins/cosmetics";
import { formatProjectType } from "~/plugins/shorthands.js";
import { isDarkTheme, type Theme } from "~/plugins/theme/index.ts";

useHead({
    title: "Display settings - Modrinth",
});


const cosmetics = useCosmetics();
const flags = useFeatureFlags();
const tags = useTags();

const theme = useTheme();

// On the server the value of native theme can be 'unknown'. To hydrate
// correctly, we need to make sure we aren't using 'unknown' and values between
// server and client renders are in sync.

const serverSystemTheme = useState(() => {
    const theme_ = theme.native;
    if (theme_ === "unknown") return "light";
    return theme_;
});

const systemTheme = useMountedValue((mounted): Theme => {
    const systemTheme_ = mounted ? theme.native : serverSystemTheme.value;
    return systemTheme_ === "light"
        ? theme.preferences.light
        : theme.preferences.dark;
});

const themeOptions = computed(() => {
    const options: ("system" | Theme)[] = ["system", "light", "dark", "oled"];
    if (flags.value.developerMode || theme.preferred === "retro") {
        options.push("retro");
    }
    return options;
});

function updateColorTheme(value: Theme | "system") {
    if (value !== "system") {
        if (isDarkTheme(value)) {
            theme.preferences.dark = value;
        } else {
            theme.preferences.light = value;
        }
    }

    theme.preferred = value;
}

function disableDeveloperMode() {
    flags.value.developerMode = !flags.value.developerMode;
    saveFeatureFlags();
    addNotification({
        group: "main",
        title: "Developer mode deactivated",
        text: "Developer mode has been disabled",
        type: "success",
    });
}

const listTypes = computed(() => {
    const types = tags.value.projectTypes.map((type) => {
        return {
            id: type.id as DisplayLocation,
            name: formatProjectType(type.id) + "s",
            display:
                "the " +
                formatProjectType(type.id).toLowerCase() +
                "s search page",
        };
    });

    types.push({
        id: "user" as DisplayLocation,
        name: "User profiles",
        display: "user pages",
    });

    return types;
});
</script>
<style scoped lang="scss">
.project-lists {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);

    > :first-child .label__title {
        margin-top: 0;
    }

    .preview {
        --_layout-width: 7rem;
        --_layout-height: 4.5rem;
        --_layout-gap: 0.25rem;

        .example-card {
            border-radius: 0.5rem;
            width: var(--_layout-width);
            height: calc((var(--_layout-height) - 3 * var(--_layout-gap)) / 4);
            padding: 0;
        }

        .layout-list-mode {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--_layout-gap);
        }

        .layout-grid-mode {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: var(--_layout-gap);

            .example-card {
                width: calc(
                    (var(--_layout-width) - 2 * var(--_layout-gap)) / 3
                );
                height: calc((var(--_layout-height) - var(--_layout-gap)) / 2);
            }
        }

        .layout-gallery-mode {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--_layout-gap);

            .example-card {
                width: calc((var(--_layout-width) - var(--_layout-gap)) / 2);
                height: calc((var(--_layout-height) - var(--_layout-gap)) / 2);
            }
        }
    }
}

.project-list-layouts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
    gap: var(--gap-lg);

    .preview-radio .example-card {
        border: 2px solid transparent;
    }

    .preview-radio.selected .example-card {
        border-color: var(--color-brand);
        background-color: var(--color-brand-highlight);
    }

    .preview {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.developer-message {
    svg {
        vertical-align: middle;
        margin-bottom: 2px;
        margin-right: 0.5rem;
    }

    .btn {
        margin-top: var(--gap-sm);
    }
}
</style>
