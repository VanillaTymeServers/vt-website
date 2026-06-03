<template>
    <div
        ref="pickerEl"
        class="item-picker"
        :class="{ disabled }"
        tabindex="0"
        @focusout="handleFocusOut"
        @keydown.escape="close"
    >
        <!-- Trigger button -->
        <div
            class="selected"
            :class="{
                disabled,
                'render-down': open,
            }"
            @click="toggle"
        >
            <div class="item-display">
                <img
                    v-if="selectedIconSrc"
                    :src="selectedIconSrc"
                    class="mc-icon"
                    alt=""
                />
                <div v-else class="mc-icon mc-icon--empty" />
                <span>{{ modelValue?.label ?? placeholder }}</span>
            </div>
            <IconChevronDown class="arrow" :class="{ rotate: open }" />
        </div>

        <!-- Dropdown -->
        <div class="options-wrapper">
            <transition name="options">
                <div v-show="open" class="options down">
                    <div class="search-row">
                        <IconSearch class="search-icon" />
                        <input
                            ref="searchInputEl"
                            v-model="query"
                            type="text"
                            placeholder="Search items..."
                            class="search-input"
                            @keydown.escape.prevent="close"
                            @keydown.enter.prevent="selectFirst"
                        />
                    </div>
                    <div class="options-list">
                        <template v-if="!query && pinnedFiltered.length">
                            <div class="group-label">Popular</div>
                            <div
                                v-for="item in pinnedFiltered"
                                :key="`pinned-${item.name}`"
                                class="option"
                                :class="{
                                    'selected-option': modelValue?.id === item.name,
                                }"
                                @click="select(item)"
                            >
                                <img
                                    :src="`data:image/png;base64,${item.icon}`"
                                    class="mc-icon"
                                    alt=""
                                />
                                <span>{{ item.label }}</span>
                            </div>
                            <div class="group-divider" />
                        </template>
                        <div
                            v-for="item in filtered"
                            :key="item.name"
                            class="option"
                            :class="{
                                'selected-option': modelValue?.id === item.name,
                            }"
                            @click="select(item)"
                        >
                            <img
                                :src="`data:image/png;base64,${item.icon}`"
                                class="mc-icon"
                                alt=""
                            />
                            <span>{{ item.label }}</span>
                        </div>
                        <div v-if="!filtered.length && !pinnedFiltered.length" class="no-results">
                            No items found
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronDown, IconSearch } from "@tabler/icons-vue";
import { computed, nextTick, ref } from "vue";

interface MinecraftItemOption {
    name: string;
    label: string;
    icon: string;
}

interface SelectedItem {
    id: string;
    label: string;
    icon: any;
}

const props = withDefaults(
    defineProps<{
        modelValue: SelectedItem | null;
        items: MinecraftItemOption[];
        placeholder?: string;
        name: string;
        disabled?: boolean;
        pinnedItems?: string[];
    }>(),
    {
        placeholder: "Select an item...",
        disabled: false,
        pinnedItems: () => [],
    },
);

const emit = defineEmits<{
    "update:modelValue": [value: SelectedItem | null];
    change: [value: SelectedItem | null];
}>();

const MAX_DISPLAY = 100;

const pickerEl = ref<HTMLElement | null>(null);
const searchInputEl = ref<HTMLInputElement | null>(null);
const open = ref(false);
const query = ref("");

function getIconSrc(icon: any): string | null {
    if (!icon) return null;
    if (typeof icon === "string") return `data:image/png;base64,${icon}`;
    // Buffer serialized to JSON: { type: 'Buffer', data: number[] }
    if (icon?.data) {
        const bytes = new Uint8Array(icon.data);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return `data:image/png;base64,${btoa(binary)}`;
    }
    return null;
}

const selectedIconSrc = computed(() => getIconSrc(props.modelValue?.icon ?? null));

const pinnedFiltered = computed(() =>
    props.pinnedItems
        .map((name) => props.items.find((i) => i.name === name))
        .filter((i): i is MinecraftItemOption => !!i),
);

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    const pinned = new Set(props.pinnedItems);
    const source = q ? props.items : props.items.filter((i) => !pinned.has(i.name));
    if (!q) return source.slice(0, MAX_DISPLAY);
    return source
        .filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q),
        )
        .slice(0, MAX_DISPLAY);
});

function toggle() {
    if (props.disabled) return;
    open.value ? close() : openPicker();
}

async function openPicker() {
    open.value = true;
    await nextTick();
    searchInputEl.value?.focus();
}

function close() {
    open.value = false;
    query.value = "";
}

function select(item: MinecraftItemOption) {
    const value: SelectedItem = {
        id: item.name,
        label: item.label,
        icon: item.icon,
    };
    emit("update:modelValue", value);
    emit("change", value);
    close();
}

function selectFirst() {
    if (filtered.value.length > 0) {
        select(filtered.value[0]);
    }
}

function handleFocusOut(event: FocusEvent) {
    if (!pickerEl.value?.contains(event.relatedTarget as Node)) {
        close();
    }
}
</script>

<style lang="scss" scoped>
.item-picker {
    position: relative;
    display: block;

    &:focus {
        outline: 0;
    }

    .mc-icon {
        width: 24px;
        height: 24px;
        image-rendering: pixelated;
        flex-shrink: 0;
        border-radius: var(--radius-xs);

        &.mc-icon--empty {
            background-color: var(--color-raised-bg);
        }
    }

    .selected {
        height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--gap-sm) var(--gap-lg);
        background-color: var(--color-button-bg);
        gap: var(--gap-md);
        cursor: pointer;
        user-select: none;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-inset-sm), 0 0 0 0 transparent;
        transition: 0.05s;

        &.render-down {
            border-radius: var(--radius-md) var(--radius-md) 0 0;
        }

        &.disabled {
            cursor: not-allowed;
            filter: grayscale(50%);
            opacity: 0.5;
        }

        &:hover:not(.disabled) {
            filter: brightness(0.92);
        }

        .item-display {
            display: flex;
            align-items: center;
            gap: var(--gap-sm);
            min-width: 0;
            flex: 1;

            span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .arrow {
            flex-shrink: 0;
            transition: transform 0.2s ease;

            &.rotate {
                transform: rotate(180deg);
            }
        }
    }

    .options-wrapper {
        position: absolute;
        width: 100%;
        z-index: 20;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        overflow: hidden;
    }

    .options {
        background-color: var(--color-button-bg);
        box-shadow:
            var(--shadow-inset-sm),
            0 4px 12px rgba(0, 0, 0, 0.12);

        .search-row {
            display: flex;
            align-items: center;
            padding: var(--gap-sm) var(--gap-md);
            gap: var(--gap-sm);
            border-bottom: 1px solid var(--color-raised-bg);

            .search-icon {
                flex-shrink: 0;
                color: var(--color-secondary);
            }

            .search-input {
                background: transparent;
                border: none;
                box-shadow: none;
                padding: 0;
                max-height: unset;
                flex: 1;
                outline: none;
                font-size: inherit;
                color: inherit;
            }
        }

        .options-list {
            max-height: 14rem;
            overflow-y: auto;

            .option {
                display: flex;
                align-items: center;
                gap: var(--gap-sm);
                padding: var(--gap-sm) var(--gap-md);
                cursor: pointer;
                user-select: none;

                span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                &:hover {
                    filter: brightness(0.85);
                    transition: filter 0.2s ease-in-out;
                }

                &.selected-option {
                    background-color: var(--color-brand);
                    color: var(--color-accent-contrast);
                    font-weight: bold;
                }
            }

            .no-results {
                padding: var(--gap-md);
                text-align: center;
                color: var(--color-secondary);
                font-size: 0.875rem;
            }

            .group-label {
                padding: var(--gap-xs) var(--gap-md);
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--color-secondary);
            }

            .group-divider {
                height: 1px;
                background-color: var(--color-raised-bg);
                margin: var(--gap-xs) 0;
            }
        }
    }
}

.options-enter-active,
.options-leave-active {
    transition: transform 0.2s ease;
}

.options-enter-from,
.options-leave-to {
    &.down {
        transform: translateY(-99.999%);
    }
}
</style>
