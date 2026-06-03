<template>
    <div class="relative space-y-2" ref="">
        <BubbleMenu v-if="editor" :editor="editor" class="bubble-menu">
            <div>
                <button
                    @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }"
                >
                    <div class="flex flex-row">
                        <span>
                            <Bold />
                        </span>
                    </div>
                </button>
            </div>
            <div>
                <button
                    @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }"
                >
                    <div class="flex flex-row">
                        <span>
                            <Italic />
                        </span>
                    </div>
                </button>
            </div>
            <div>
                <button
                    @click="editor.chain().focus().toggleUnderline().run()"
                    :class="{ 'is-active': editor.isActive('underline') }"
                >
                    <div class="flex flex-row">
                        <span>
                            <Underline />
                        </span>
                    </div>
                </button>
            </div>
            <button
                @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }"
            >
                <div class="flex flex-row">
                    <span>
                        <Strikethrough />
                    </span>
                </div>
            </button>
            <div ref="highlightMenuRef" class="relative inline-flex">
                <button
                    @click.stop="toggleHighlightMenu"
                    class="flex items-center gap-1"
                    :class="{
                        'is-active': editor.isActive('highlight'),
                    }"
                >
                    <div class="flex flex-row">
                        <span>
                            <Highlighter />
                        </span>
                    </div>
                </button>

                <div v-if="showHighlightMenu" class="highlight-menu">
                    <div>
                        <div class="custom-buttons flex items-center gap-[1px]">
                            <button
                                v-for="color in presetHighlightColors"
                                :key="color"
                                :style="{ '--background': color }"
                                @click.stop="applyHighlight(color)"
                                :class="{
                                    'is-active': editor.isActive('highlight', {
                                        color,
                                    }),
                                }"
                            >
                                <div class="flex flex-row"></div>
                            </button>
                            <button
                                type="button"
                                :disabled="!editor.isActive('highlight')"
                                class="cancel-button"
                            >
                                <div class="flex h-4 w-4 flex-row">
                                    <Ban
                                        @click.stop="clearHighlight"
                                        :v-tooltip="
                                            !editor.isActive('highlight')
                                                ? 'Clear highlight'
                                                : ''
                                        "
                                    />
                                </div>
                            </button>
                        </div>

                        <div
                            class="divider-border mt-0.5 flex items-center gap-[1px] pt-0.5"
                        >
                            <div
                                class="hex-input text-input-wrapper mx-2 my-1 !flex flex-1 flex-col"
                            >
                                <span class="text-input-wrapper__before"
                                    >#</span
                                >
                                <input
                                    v-model="hexInput"
                                    type="text"
                                    class="!min-h-4 !w-full !pl-2 font-mono"
                                    @input="onHexInput"
                                />
                                <div
                                    class="text-input-wrapper__after m-auto mr-4 !h-4 !min-h-4 !w-4 rounded"
                                    :style="
                                        previewColor
                                            ? { backgroundColor: previewColor }
                                            : {}
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref="linkModuleRef" class="relative inline-flex">
                <!-- normal link icon when module closed -->
                <button type="button" @click.stop="openLinkModule">
                    <div class="flex flex-row">
                        <span>
                            <Link />
                        </span>
                    </div>
                </button>
                <!-- absolute left-1/2 top-full mt-1 flex -translate-x-1/2 items-center gap-2 rounded border bg-bg p-2 text-xs shadow  -->
                <div v-if="showLinkModule" class="link-menu">
                    <div>
                        <!-- URL input -->
                        <input
                            v-model="linkUrl"
                            type="text"
                            autocomplete="off"
                            placeholder="Type or paste a link"
                        />
                        <!-- Apply / Back button depending on input -->
                        <button
                            type="button"
                            class="rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                            @click.stop="submitOrBackLinkModule"
                        >
                            <Check v-if="linkUrl.trim()" />
                            <CornerDownLeft v-else />
                        </button>
                        <div class="link-divider"></div>
                        <div>
                            <button
                                type="button"
                                :disabled="!linkUrl.trim()"
                                @click.stop="toggleLinkSettings"
                                :class="{ 'is-open': showLinkSettings }"
                            >
                                <div class="flex flex-row">
                                    <span>
                                        <Settings2 />
                                    </span>
                                    <span class="icon-down">
                                        <ChevronDown />
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div v-if="showLinkSettings" class="link-settings">
                            <label>
                                <div>
                                    <span>Open in new tab</span>
                                </div>
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="linkOpenInNewTab"
                                    />
                                    <span></span>
                                </label>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <button
                @click="editor.chain().focus().toggleCode().run()"
                :class="{ 'is-active': editor.isActive('code') }"
            >
                <div class="flex flex-row">
                    <span>
                        <Code />
                    </span>
                </div>
            </button>
            <button
                @click="editor.chain().focus().toggleSuperscript().run()"
                :class="{ 'is-active': editor.isActive('superscript') }"
            >
                <div class="flex flex-row">
                    <span>
                        <Superscript />
                    </span>
                </div>
            </button>
            <button
                @click="editor.chain().focus().toggleSubscript().run()"
                :class="{ 'is-active': editor.isActive('subscript') }"
            >
                <div class="flex flex-row">
                    <span>
                        <Subscript />
                    </span>
                </div>
            </button>
            <div ref="headingMenuRef" class="relative inline-flex">
                <button
                    @click.stop="toggleHeadingMenu"
                    class="flex items-center gap-1"
                >
                    <Heading />
                    <ChevronDown />
                </button>
                <div
                    v-if="showHeadingMenu"
                    class="absolute left-1/2 top-full mt-1 flex -translate-x-1/2 rounded border text-xs shadow"
                >
                    <button class="px-2 py-1 text-left" @click="setHeading(1)">
                        <Heading1 />
                    </button>
                    <button class="px-2 py-1 text-left" @click="setHeading(2)">
                        <Heading2 />
                    </button>
                    <button class="px-2 py-1 text-left" @click="setHeading(3)">
                        <Heading3 />
                    </button>
                    <button class="px-2 py-1 text-left" @click="setHeading(4)">
                        <Heading4 />
                    </button>
                    <button class="px-2 py-1 text-left" @click="setHeading(5)">
                        <Heading5 />
                    </button>
                    <button class="px-2 py-1 text-left" @click="setHeading(6)">
                        <Heading6 />
                    </button>
                    <button
                        class="px-2 py-1 text-left"
                        @click="setHeading(null)"
                    >
                        <CircleOff />
                    </button>
                </div>
            </div>
            <div class="relative inline-flex">
                <button
                    @click.stop="toggleListMenu"
                    class="flex items-center gap-1"
                >
                    <List /> <ChevronDown />
                </button>
                <div
                    v-if="showListMenu"
                    ref="listMenuRef"
                    class="absolute left-1/2 top-full mt-1 flex -translate-x-1/2 rounded border text-xs shadow"
                >
                    <button
                        class="px-2 py-1 text-left"
                        @click="toggleBulletList"
                    >
                        <List />
                    </button>
                    <button
                        class="px-2 py-1 text-left"
                        @click="toggleOrderedList"
                    >
                        <ListOrdered />
                    </button>
                    <button class="px-2 py-1 text-left" @click="toggleTaskList">
                        <ListTodo />
                    </button>
                    <button
                        class="px-2 py-1 text-left"
                        @click="clearListFormatting"
                    >
                        <IconCancel />
                    </button>
                </div>
            </div>
            <button
                @click="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'is-active': editor.isActive('blockquote') }"
            >
                <div class="flex flex-row">
                    <span>
                        <TextQuote />
                    </span>
                </div>
            </button>
            <button
                @click="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'is-active': editor.isActive('codeBlock') }"
            >
                <div class="flex flex-row">
                    <span>
                        <SquareCode />
                    </span>
                </div>
            </button>
            <div class="relative inline-flex">
                <button
                    @click.stop="toggleAlignMenu"
                    class="flex items-center gap-1"
                >
                    <TextAlignStart />
                    <ChevronDown />
                </button>
                <div
                    v-if="showAlignMenu"
                    ref="alignMenuRef"
                    class="absolute left-1/2 top-full mt-1 flex -translate-x-1/2 rounded border bg-bg text-xs shadow"
                >
                    <button
                        class="px-2 py-1 text-left"
                        @click="setTextAlign('left')"
                    >
                        <TextAlignStart />
                    </button>
                    <button
                        class="px-2 py-1 text-left"
                        @click="setTextAlign('center')"
                    >
                        <TextAlignCenter />
                    </button>
                    <button
                        class="px-2 py-1 text-left"
                        @click="setTextAlign('right')"
                    >
                        <TextAlignEnd />
                    </button>
                    <button
                        class="px-2 py-1 text-left"
                        @click="setTextAlign('justify')"
                    >
                        <TextAlignJustify />
                    </button>
                </div>
            </div>
            <button><Settings2 /></button>
        </BubbleMenu>
        <div ref="editorAreaRef" class="relative">
            <div
                v-if="showExistingLinkModule && existingLinkRect"
                class="link-edit-menu"
                :style="{
                    left: existingLinkRect.left + 'px',
                    transform: 'translateX(-50%)',
                    top:
                        existingLinkPlacement === 'below'
                            ? existingLinkRect.top +
                              existingLinkRect.height +
                              0 +
                              'px'
                            : existingLinkRect.top - 32 + 'px', // ~menu height + gap
                }"
            >
                <!-- VIEW MODE: show URL + Edit/Delete -->
                <template v-if="!existingLinkEditMode">
                    <div>
                        <div>
                            <span>
                                <span>
                                    <Globe />
                                </span>
                            </span>
                            <a
                                class="text-muted-foreground max-w-[260px] truncate text-xs"
                                :href="existingLinkUrl"
                                target="_blank"
                                :title="existingLinkUrl"
                            >
                                {{ existingLinkUrl }}
                            </a>
                            <div>
                                <button
                                    type="button"
                                    class="rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                                    @click="existingLinkEditMode = true"
                                    v-tooltip="'Edit link'"
                                >
                                    <Pencil />
                                </button>
                            </div>
                            <div class="divider"></div>
                            <div>
                                <button
                                    type="button"
                                    class="text-red-500 rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                                    @click="removeExistingLink"
                                    v-tooltip="'Remove link'"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- EDIT MODE: input + checkbox + Apply/Cancel -->
                <template v-else>
                    <div>
                        <div>
                            <input
                                v-model="existingLinkUrl"
                                type="text"
                                placeholder="https://example.com"
                            />
                            <button type="button" @click="applyExistingLink">
                                <CornerDownLeft />
                            </button>
                            <div class="divider"></div>
                            <div>
                                <div>
                                    <button
                                        type="button"
                                        :disabled="!existingLinkUrl"
                                        @click="toggleExistingLinkSettings"
                                        :class="{
                                            'is-open': showExistingLinkSettings,
                                        }"
                                    >
                                        <div class="flex flex-row">
                                            <span><Settings2 /></span>
                                            <span class="icon-down"
                                                ><ChevronDown
                                            /></span>
                                        </div>
                                    </button>
                                </div>
                                <div
                                    v-if="showExistingLinkSettings"
                                    class="link-settings"
                                >
                                    <label>
                                        <div>
                                            <span>Open in new tab</span>
                                        </div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                v-model="
                                                    existingLinkOpenInNewTab
                                                "
                                            />
                                            <span></span>
                                        </label>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div
                v-if="slashOpen && slashItems.length"
                ref="slashMenuRef"
                class="slash-menu"
                :style="{ left: slashLeft + 'px', top: slashTop + 'px' }"
                @mousedown.prevent
            >
                <template v-for="group in groupedSlashItems" :key="group.category">
                    <div class="slash-category">{{ group.category }}</div>
                    <div
                        v-for="item in group.items"
                        :key="item.title"
                        class="slash-item"
                        :class="{ 'is-active': item.title === activeSlashTitle }"
                        @click="pickSlashItem(item)"
                    >
                        <div>
                            <div class="slash-item__icon">
                                <component
                                    :is="slashIconMap[item.icon]"
                                    v-if="slashIconMap[item.icon]"
                                />
                            </div>
                            <div class="slash-item__name">
                                <div>
                                    <div><span>{{ item.title }}</span></div>
                                </div>
                            </div>
                            <div
                                v-if="item.shortcut"
                                class="slash-item__shortcut"
                            >
                                <span>{{ item.shortcut }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <DragHandle
                class="pr-3"
                v-if="editor"
                :editor="editor"
                :compute-position-config="{
                    strategy: 'absolute',
                    placement: 'left',
                }"
            >
                <div class="drag-toolbar flex">
                    <div>
                        <button type="button">
                            <div class="flex flex-row">
                                <span>
                                    <Plus />
                                </span>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button type="button">
                            <div class="flex flex-row">
                                <span>
                                    <GripVertical />
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </DragHandle>
            <TiptapEditorContent
                :editor="editor"
                class="min-h-[300px] rounded-md border p-3"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Ban,
    Bold,
    Check,
    ChevronDown,
    CircleOff,
    Code,
    CornerDownLeft,
    Globe,
    Globe2,
    GripVertical,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Highlighter,
    Italic,
    Link,
    List,
    ListOrdered,
    ListTodo,
    Pencil,
    Plus,
    Settings2,
    SquareCode,
    Strikethrough,
    Subscript,
    Superscript,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    TextAlignStart,
    TextQuote,
    Minus,
    Trash2,
    Underline,
} from "lucide-vue-next";
import { IconCancel, IconBrandYoutubeFilled } from "@tabler/icons-vue";

import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Level } from "@tiptap/extension-heading";
import { onClickOutside } from "@vueuse/core";
import { common, createLowlight } from "lowlight";
import { SlashCommand, type SlashItem } from "@/composables/slashCommand";
import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
import { offset } from "@floating-ui/dom";
const editorAreaRef = ref<HTMLElement | null>(null);
const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const lowlight = createLowlight(common);
const editor = useEditor({
    content: props.modelValue,
    extensions: [
        tiptapStarterKit,
        tiptapBubbleMenu.configure({
            pluginKey: "bubbleMenu",
        }),
        tiptapCharacterCount,
        tiptapHighlight,
        tiptapStrike,
        tiptapLink.configure({
            openOnClick: false,
        }),
        tiptapCode,
        tiptapSuperscript,
        tiptapSubscript,
        tiptapTaskList,
        tiptapTaskItem,
        tiptapCodeBlockLowlight.configure({
            lowlight,
        }),
        tiptapTextAlign.configure({
            types: ["heading", "paragraph"],
            defaultAlignment: "left",
        }),
        tiptapTypography,
        tiptapYoutube.configure({
            nocookie: true,
        }),
        tiptapPlaceholder.configure({
            placeholder: "Click here to start typing...",
        }),
        tiptapFocus.configure({
            className: "has-focus",
            mode: "all",
        }),
        SlashCommand.configure({
            onOpen: ({ items, clientRect, range }) => {
                slashItems.value = items;
                slashIndex.value = 0;
                slashOpen.value = true;
                slashRange.value = range;
                updateSlashPosition(clientRect);
            },
            onUpdate: ({ items, clientRect, range }) => {
                slashItems.value = items;
                slashIndex.value = 0;
                slashRange.value = range;
                updateSlashPosition(clientRect);
            },
            onClose: () => {
                slashOpen.value = false;
                slashItems.value = [];
                slashIndex.value = 0;
                slashRange.value = null;
            },
            onKeyDown: ({ event, items, command }) => {
                if (!items?.length) return false;

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    slashIndex.value = (slashIndex.value + 1) % items.length;
                    scrollActiveSlashItemIntoView();
                    return true;
                }
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    slashIndex.value =
                        (slashIndex.value - 1 + items.length) % items.length;
                    scrollActiveSlashItemIntoView();
                    return true;
                }
                if (event.key === "Enter") {
                    event.preventDefault();
                    command(items[slashIndex.value]);
                    return true;
                }
                if (event.key === "Escape") {
                    event.preventDefault();
                    slashOpen.value = false;
                    return true;
                }
                return false;
            },
        }),
        tiptapNodeRange.configure({ key: null }),
    ],
    editorProps: {
        attributes: {
            class: "tiptap",
        },
        handleClick(view, pos, event) {
            const target = event.target as HTMLElement | null;
            const linkEl = target?.closest("a");
            if (!linkEl) return false; // not a link

            event.preventDefault();
            event.stopPropagation();

            // Read link attrs from DOM
            const href = linkEl.getAttribute("href") || "";
            const targetAttr = linkEl.getAttribute("target") || "";

            existingLinkUrl.value = href;
            existingLinkOpenInNewTab.value = targetAttr === "_blank";
            existingLinkEditMode.value = false;

            // Position Module B centered on this <a>
            const linkRect = linkEl.getBoundingClientRect();
            const areaRect = editorAreaRef.value?.getBoundingClientRect();
            if (!areaRect) return;

            existingLinkRect.value = {
                top: linkRect.top - areaRect.top,
                left: linkRect.left - areaRect.left + linkRect.width / 2,
                width: linkRect.width,
                height: linkRect.height,
            };
            const viewportHeight = window.innerHeight;
            const belowY = linkRect.bottom + 8;
            existingLinkPlacement.value =
                belowY + 60 < viewportHeight ? "below" : "above";
            showExistingLinkModule.value = true;

            return true; // handled, no navigation
        },
    },
    onUpdate({ editor }) {
        emit("update:modelValue", editor.getHTML());
    },
});
const isBubbleMenuVisible = computed(() => {
    return (
        !!editor.value?.isActive("textStyle") ||
        !!editor.value?.isActive("paragraph")
    );
});

const wordCount = computed(
    () => editor.value?.storage.characterCount?.words() ?? 0,
);
const characterCount = computed(
    () => editor.value?.storage.characterCount?.characters() ?? 0,
);
watch(
    () => props.modelValue,
    (value) => {
        if (!editor.value) return;
        if (editor.value.getHTML() === value) return;
        editor.value.commands.setContent(value || "", { emitUpdate: false });
    },
);
const showHeadingMenu = ref(false);
const headingMenuRef = ref<HTMLElement | null>(null);
const toggleHeadingMenu = () => {
    showHeadingMenu.value = !showHeadingMenu.value;
};
onClickOutside(headingMenuRef, () => {
    showHeadingMenu.value = false;
});
const closeHeadingMenu = () => {
    showHeadingMenu.value = false;
};
const currentHeading = computed(() => {
    if (!editor.value) return "Paragraph";
    for (let level = 1; level <= 6; level++) {
        if (editor.value.isActive("heading", { level })) return `H${level}`;
    }
    return "Paragraph";
});

const setHeading = (level: number | null) => {
    if (!editor.value) return;
    const chain = editor.value.chain().focus();
    if (level === null) {
        chain.setParagraph().run();
    } else {
        chain.toggleHeading({ level: level as Level }).run();
    }
};

const showHighlightMenu = ref(false);
const highlightMenuRef = ref<HTMLElement | null>(null);
const highlightColor = ref<string | undefined>(undefined);
const hexInput = ref<string>("");
const previewColor = ref<string | null>(null);

const computedHexWithHash = computed(() => {
    const value = hexInput.value.trim();
    if (!value) return "";
    return value.startsWith("#") ? value : `#${value}`;
});

const toggleHighlightMenu = () => {
    showHighlightMenu.value = !showHighlightMenu.value;
};

onClickOutside(highlightMenuRef, () => {
    showHighlightMenu.value = false;
});
const openHighlightMenu = () => {
    showHighlightMenu.value = true;
};

const presetHighlightColors = [
    "#facc15", // yellow
    "#f97316", // orange
    "#22c55e", // green
    "#38bdf8", // blue
    "#a855f7", // purple
];

const applyHighlight = (color: string) => {
    if (!editor.value) return;
    highlightColor.value = color;
    hexInput.value = color.replace(/^#/, "");
    previewColor.value = color;
    editor.value.chain().focus().setHighlight({ color }).run();
};

const clearHighlight = () => {
    if (!editor.value) return;
    highlightColor.value = undefined;
    hexInput.value = "";
    previewColor.value = null;
    editor.value.chain().focus().unsetHighlight().run();
};

const onHexInput = () => {
    if (!editor.value) return;
    let value = hexInput.value.trim();
    if (!value) {
        previewColor.value = null;
        // optional: also clear highlight when field is emptied
        editor.value.commands.unsetHighlight();
        return;
    }
    if (!value.startsWith("#")) {
        value = `#${value}`;
    }
    const hex = value.slice(1);
    const isValid =
        /^[0-9a-fA-F]{3}$/.test(hex) || /^[0-9a-fA-F]{6}$/.test(hex);
    if (!isValid) {
        previewColor.value = null;
        return;
    }
    const final = value.toLowerCase();
    previewColor.value = final;
    highlightColor.value = final;
    // apply without stealing focus from the input
    editor.value.commands.setHighlight({ color: final });
};
const showLinkModule = ref(false);
const linkUrl = ref("");
const showLinkSettings = ref(false);
const showExistingLinkSettings = ref(false);
const linkOpenInNewTab = ref(true);
const showExistingLinkModule = ref(false);
const existingLinkUrl = ref("");
const existingLinkOpenInNewTab = ref(true);
const existingLinkEditMode = ref(false);
const openLinkModule = () => {
    showLinkModule.value = true;
    // Prefill from existing link mark if present
    const attrs = editor.value?.getAttributes("link") as
        | { href?: string; target?: string }
        | undefined;
    linkUrl.value = attrs?.href || "";
    linkOpenInNewTab.value = attrs?.target === "_blank";
};

const closeLinkModule = () => {
    showLinkModule.value = false;
    showLinkSettings.value = false;
};

const toggleLinkSettings = () => {
    showLinkSettings.value = !showLinkSettings.value;
};

const toggleExistingLinkSettings = () => {
    showExistingLinkSettings.value = !showExistingLinkSettings.value;
};

const submitOrBackLinkModule = () => {
    if (!editor.value) return;
    const url = linkUrl.value.trim();

    // Empty = just act like back/close
    if (!url) {
        closeLinkModule();
        return;
    }

    const attrs: {
        href: string;
        target?: string | null;
        rel?: string | null;
    } = { href: url };

    if (linkOpenInNewTab.value) {
        attrs.target = "_blank";
        attrs.rel = "noopener noreferrer";
    } else {
        attrs.target = null;
        attrs.rel = null;
    }

    editor.value.chain().focus().extendMarkRange("link").setLink(attrs).run();

    closeLinkModule();
};

const removeExistingLink = () => {
    if (!editor.value) return;
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    showExistingLinkModule.value = false;
    existingLinkUrl.value = "";
};

const applyExistingLink = () => {
    if (!editor.value) return;
    const url = existingLinkUrl.value.trim();
    if (!url) {
        // treat empty as remove
        removeExistingLink();
        return;
    }

    const attrs: {
        href: string;
        target?: string | null;
        rel?: string | null;
    } = { href: url };

    if (existingLinkOpenInNewTab.value) {
        attrs.target = "_blank";
        attrs.rel = "noopener noreferrer";
    } else {
        attrs.target = null;
        attrs.rel = null;
    }

    editor.value.chain().focus().extendMarkRange("link").setLink(attrs).run();

    existingLinkEditMode.value = false;
    showExistingLinkModule.value = false;
};

const cancelExistingLinkEdit = () => {
    existingLinkEditMode.value = false;
};
const linkModuleRef = ref<HTMLElement | null>(null);
onClickOutside(linkModuleRef, () => {
    closeLinkModule();
    linkUrl.value = "";
});

const isLinkEditMode = ref(false);

const existingLinkRect = ref<{
    top: number;
    left: number;
    width: number;
    height: number;
} | null>(null);
const existingLinkPlacement = ref<"above" | "below">("below");

onMounted(() => {
    editor.value?.on("selectionUpdate", () => {
        showHighlightMenu.value = false;

        const ed = editor.value;
        if (!ed) return;

        const isCursorStrictlyInsideLink = (state: any) => {
            const { selection, schema, doc } = state;
            if (!selection?.empty) return false;

            const pos = selection.from;
            const linkMark = schema.marks.link;
            if (!linkMark) return false;

            // Need at least one character on both sides
            if (pos <= 0) return false;
            if (pos >= doc.content.size) return false;

            const beforeIsLink = doc.rangeHasMark(pos - 1, pos, linkMark);
            const afterIsLink = doc.rangeHasMark(pos, pos + 1, linkMark);

            // Strictly inside: not at start or end of the link
            return beforeIsLink && afterIsLink;
        };

        if (isCursorStrictlyInsideLink(ed.state)) {
            const attrs = ed.getAttributes("link") as {
                href?: string;
                target?: string;
            };
            existingLinkUrl.value = attrs.href || "";
            existingLinkOpenInNewTab.value = attrs.target === "_blank";
            existingLinkEditMode.value = false;
            showExistingLinkModule.value = true;

            // Find the DOM <a> node
            const { from } = ed.state.selection;
            const dom = ed.view.domAtPos(from).node as HTMLElement | null;
            const linkEl = dom?.closest("a");
            if (!linkEl) return;

            const rect = linkEl.getBoundingClientRect();
            const areaRect = editorAreaRef.value?.getBoundingClientRect();
            if (!areaRect) return;

            existingLinkRect.value = {
                top: rect.top - areaRect.top,
                left: rect.left - areaRect.left + rect.width / 2,
                width: rect.width,
                height: rect.height,
            };

            const viewportHeight = window.innerHeight;
            const belowY = rect.bottom + 8;
            const aboveY = rect.top - 8;

            existingLinkPlacement.value =
                belowY + 60 < viewportHeight ? "below" : "above"; // 60px buffer
        } else {
            showExistingLinkModule.value = false;
            existingLinkEditMode.value = false;
            existingLinkUrl.value = "";
            existingLinkRect.value = null;
        }
    });
});
const showListMenu = ref(false);
const toggleListMenu = () => {
    showListMenu.value = !showListMenu.value;
};

const toggleBulletList = () => {
    if (!editor.value) return;
    editor.value.chain().focus().toggleBulletList().run();
};

const toggleOrderedList = () => {
    if (!editor.value) return;
    editor.value.chain().focus().toggleOrderedList().run();
};
const toggleTaskList = () => {
    if (!editor.value) return;
    editor.value.chain().focus().toggleTaskList().run();
};

const clearListFormatting = () => {
    if (!editor.value) return;
    // Try to lift out of any list; if not possible, just set paragraph
    const chain = editor.value.chain().focus();
    if (!chain.liftListItem("listItem").run()) {
        editor.value.chain().focus().setParagraph().run();
    }
};
const listMenuRef = ref<HTMLElement | null>(null);

const showAlignMenu = ref(false);
const alignMenuRef = ref<HTMLElement | null>(null);

const toggleAlignMenu = () => {
    showAlignMenu.value = !showAlignMenu.value;
};

const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
    if (!editor.value) return;
    editor.value.chain().focus().setTextAlign(alignment).run();
    showAlignMenu.value = false;
};

onClickOutside(alignMenuRef, () => {
    showAlignMenu.value = false;
});

onClickOutside(listMenuRef, () => {
    showListMenu.value = false;
});

const slashOpen = ref(false);
const slashItems = ref<SlashItem[]>([]);
const slashIndex = ref(0);
const slashLeft = ref(0);
const slashTop = ref(0);
const slashRange = ref<{ from: number; to: number } | null>(null);
const SLASH_MENU_GAP = 8;
const slashMenuRef = ref<HTMLElement | null>(null);

const slashIconMap: Record<string, any> = {
    List,
    ListOrdered,
    ListTodo,
    TextQuote,
    SquareCode,
    Minus,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    IconBrandYoutubeFilled,
};

const activeSlashTitle = computed(() =>
    slashItems.value[slashIndex.value]?.title ?? "",
);

const groupedSlashItems = computed(() => {
    const order: Array<SlashItem["category"]> = ["Basic", "Headings", "Media"];
    return order
        .map((category) => ({
            category,
            items: slashItems.value.filter((i) => i.category === category),
        }))
        .filter((g) => g.items.length > 0);
});

const scrollActiveSlashItemIntoView = () => {
    nextTick(() => {
        const menuEl = slashMenuRef.value;
        if (!menuEl) return;

        const activeEl = menuEl.querySelector(
            ".slash-item.is-active",
        ) as HTMLElement | null;
        if (!activeEl) return;

        activeEl.scrollIntoView({ block: "nearest" });
    });
};

const updateSlashPosition = async (clientRect: DOMRect | null) => {
    const ed = editor.value;
    if (!ed || !clientRect) return;

    const editorRect = editorAreaRef.value?.getBoundingClientRect();
    if (!editorRect) return;
    slashLeft.value = clientRect.left - editorRect.left;

    await nextTick(); // wait for menu to render so we can measure it
    const menuHeight = slashMenuRef.value?.offsetHeight ?? 0;

    const spaceBelow = editorRect.bottom - clientRect.bottom;
    const spaceAbove = clientRect.top - editorRect.top;

    const fitsBelow = spaceBelow >= menuHeight + SLASH_MENU_GAP;
    const fitsAbove = spaceAbove >= menuHeight + SLASH_MENU_GAP;

    // Prefer below, else above if it fits, else pick the side with more space
    const placeBelow = fitsBelow || (!fitsAbove && spaceBelow >= spaceAbove);

    slashTop.value = placeBelow
        ? clientRect.bottom - editorRect.top + SLASH_MENU_GAP
        : clientRect.top - editorRect.top - menuHeight - SLASH_MENU_GAP;

    const maxTop = Math.max(0, editorRect.height - menuHeight);
    slashTop.value = Math.min(maxTop, Math.max(0, slashTop.value));
};

const pickSlashItem = (item: any) => {
    if (!editor.value) return;
    if (!slashRange.value) return;

    item.command({ editor: editor.value, range: slashRange.value });

    // mimic Enter behavior: close/reset
    slashOpen.value = false;
    slashItems.value = [];
    slashIndex.value = 0;
    slashRange.value = null;
};

onBeforeUnmount(() => {
    unref(editor)?.destroy();
});

defineExpose({
    editor,
    wordCount,
    characterCount,
});
</script>

<style>
.tiptap {
    outline: none;
}

.tiptap:focus-visible {
    outline: none !important;
}
.tiptap a {
    color: var(--color-brand);
    font-weight: 700;
}
.tiptap code {
    background: rgba(39, 42, 47, 0.06);
    border-radius: 0.4rem;
    font-size: 0.875rem;
    padding: 0.25em 0.3em;
    box-shadow: rgba(39, 42, 47, 0.2) 0px 0px 0px 1px;
}
.tiptap {
    :first-child {
        margin-top: 0;
    }

    /* List styles */
    ul,
    ol {
        padding: 0 1rem;
        margin: 1.25rem 1rem 1.25rem 0.4rem;

        li p {
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
    }

    /* Task list specific styles */
    ul[data-type="taskList"] {
        list-style: none;
        margin-left: 0;
        padding: 0;

        li {
            align-items: flex-start;
            display: flex;

            > label {
                flex: 0 0 auto;
                margin-right: 0.5rem;
                user-select: none;
            }

            > div {
                flex: 1 1 auto;
            }
        }

        input[type="checkbox"] {
            cursor: pointer;
            appearance: auto !important;
            min-height: unset !important;
        }

        ul[data-type="taskList"] {
            margin: 0;
        }
    }
    blockquote {
        border-left: 3px solid rgba(61, 37, 20, 0.12);
        margin: 1.5rem 0;
        padding-left: 1rem;
    }
    pre {
        background: #2e2b29;
        border-radius: 0.5rem;
        color: white;
        font-family: "JetBrainsMono", monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;

        code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }

        /* Code styling */
        .hljs-comment,
        .hljs-quote {
            color: #616161;
        }

        .hljs-variable,
        .hljs-template-variable,
        .hljs-attribute,
        .hljs-tag,
        .hljs-name,
        .hljs-regexp,
        .hljs-link,
        .hljs-name,
        .hljs-selector-id,
        .hljs-selector-class {
            color: #f98181;
        }

        .hljs-number,
        .hljs-meta,
        .hljs-built_in,
        .hljs-builtin-name,
        .hljs-literal,
        .hljs-type,
        .hljs-params {
            color: #fbbc88;
        }

        .hljs-string,
        .hljs-symbol,
        .hljs-bullet {
            color: #b9f18d;
        }

        .hljs-title,
        .hljs-section {
            color: #faf594;
        }

        .hljs-keyword,
        .hljs-selector-tag {
            color: #70cff8;
        }

        .hljs-emphasis {
            font-style: italic;
        }

        .hljs-strong {
            font-weight: 700;
        }
    }
    p.is-editor-empty:first-child::before {
        color: rgba(53, 38, 28, 0.3);
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }
    p.is-editor-empty.has-focus:first-child::before {
        color: rgba(53, 38, 28, 0.3);
        content: "Type / to insert content";
        float: left;
        height: 0;
        pointer-events: none;
    }
    .is-empty.has-focus::before {
        color: rgba(53, 38, 28, 0.3);
        content: "Type / to insert content";
        float: left;
        height: 0;
        pointer-events: none;
    }
}
.bubble-menu {
    background: rgb(39, 42, 47);
    border-radius: 8px;
    display: inline-flex;
    flex-flow: wrap;
    line-height: 1;
    padding: 0.25rem;

    > :not(:first-child) {
        margin-left: 0.125rem;
    }

    button {
        align-items: center;
        background: 0px center;
        border: 0px;
        border-radius: 8px;
        display: inline-flex;
        font-weight: 500;
        line-height: 1.2;
        text-align: left;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.875rem;
        padding: 0.3125rem;

        &:not(:disabled):hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: rgb(255, 255, 255);
        }
        &:not(:disabled).is-active {
            background-color: rgba(255, 255, 255, 0.05);
            color: var(--color-brand);
        }
        span {
            margin-left: 0px;
            margin-right: 0px;
            display: inline-block;
            height: 1rem !important;
            width: 1rem !important;

            svg {
                display: block;
                height: 100% !important;
                width: 100% !important;
            }
        }
    }
    .highlight-menu {
        z-index: 9999;
        position: absolute;
        inset: auto auto 0px 0px;
        margin: 0px;
        transform: translate3d(38.4px, -37.6px, 0px);
        background: rgb(39, 42, 47);
        border-radius: 8px;
        display: inline-flex;
        flex-flow: wrap;
        line-height: 1;
        padding: 0.25rem;

        > div:first-child {
            margin-left: 0px;
            margin-top: 0px;
        }
        button:not(.cancel-button) {
            background: 0px center;
            border: 0px;
            border-radius: 8px;
            display: inline-flex;
            font-weight: 500;
            line-height: 1.2;
            text-align: left;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.8);
            align-items: center;
            align-self: center;
            justify-content: center;
            padding: 0.375rem;

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            &:not(:disabled).is-active:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            &:not(:disabled).is-active {
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--color-brand);
            }

            &:not(:disabled):hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: rgb(255, 255, 255);
            }
            &::before {
                background-color: var(--background);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 0.375rem;
                content: "";
                height: 1rem;
                width: 1rem;
            }
            &.is-active::after,
            &:hover::after {
                position: absolute;
                border-radius: 0.5rem;
                content: "";
                border: 2px solid rgba(255, 255, 255, 0.6);
                height: calc(1.375rem);
                width: calc(1.375rem);
            }
            &.is-active::after {
                border: 2px solid var(--color-brand);
                height: calc(1.3725rem);
                width: calc(1.375rem);
            }
        }
        .divider-border {
            border-top: 1px solid rgba(229, 231, 235, 0.1);
        }
        .hex-input {
            align-items: center;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.5rem;
            color: rgba(255, 255, 255, 0.4);
            display: flex;
            margin-top: 0.5rem;
            > input {
                background: none;
                border: medium;
                color: currentColor;
                flex: 1 1 0%;
                outline: none;
                padding: 0.375rem;
            }
            &:focus {
                box-shadow: none;
            }
        }
        .cancel-button {
            align-items: center;
            background: 0px center;
            border: 0px;
            border-radius: 8px;
            display: inline-flex;
            font-weight: 500;
            line-height: 1.2;
            text-align: left;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
            padding: 0.3125rem;
            &:disabled {
                color: rgba(255, 255, 255, 0.2);
                cursor: default !important;
            }
            &:not(:disabled):hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: rgb(255, 255, 255);
            }
            svg {
                display: block;
                height: 100%;
                width: 100%;
            }
        }
    }
    .link-menu {
        z-index: 10;
        inset: auto auto 0px 0px;
        margin: 0px;
        transform: translate3d(38.4px, -37.6px, 0px);
        position: absolute;
        border-radius: 8px;
        display: inline-flex;
        flex-flow: wrap;
        line-height: 1;
        padding: 0.25rem;
        background: rgb(39, 42, 47);
        > div {
            color: rgb(255, 255, 255);
            display: flex;
            flex: 1 1 0%;
            gap: 0.125rem;
            min-width: 18rem;
        }
        > div:first-child {
            margin-left: 0px;
            margin-top: 0px;
        }
        input {
            background: transparent;
            border: 0px;
            caret-color: var(--color-brand);
            color: currentColor;
            flex: 1 1 0%;
            font-size: 0.875rem;
            font-weight: 500;
            height: 100%;
            min-height: auto;
            line-height: 1;
            outline: 0px;
            max-width: 25rem;
            padding: 0px 0.5rem;
            &:focus {
                box-shadow: none;
            }
            &::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
        }
        .link-divider {
            margin-left: 0.125rem;
            margin-right: 0.125rem;
            height: auto;
            width: 1px;
            background: rgba(255, 255, 255, 0.1);
        }
        > div > div > button:not(:disabled).is-open {
            background-color: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.8);
        }
        > div > div > button .icon-down {
            display: inline-block;
            height: 0.66rem !important;
            width: 0.66rem !important;
        }
        .link-settings {
            z-index: 9999;
            position: absolute;
            inset: auto auto 0px 0px;
            margin: 0px;
            transform: translate3d(194px, -37.6px, 0px);
            background: rgb(39, 42, 47);
            border-radius: 8px;
            display: inline-flex;
            flex-flow: wrap;
            line-height: 1;
            padding: 0.25rem;
            > label {
                align-items: center;
                cursor: pointer;
                display: flex;
                gap: 0.5rem;
                justify-content: space-between;
                line-height: 1.15;
                opacity: 1;
                padding: 0.375rem;
                > div {
                    align-items: center;
                    color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    flex: 1 1 0%;
                    font-size: 0.875rem;
                    font-weight: 500;
                    gap: 0.5rem;
                }
                > label {
                    display: inline-block;
                    height: 16px;
                    position: relative;
                    width: 28px;
                    background-color: transparent;
                    border-radius: 0px;
                    padding: 0px;
                    cursor: default;
                    input[type="checkbox"] {
                        opacity: 0;
                        width: 0px;
                        height: 0px;
                        position: absolute;
                        border-radius: 0;
                        appearance: none;
                        user-select: none;
                        color: #2563eb;
                        print-color-adjust: exact;
                        background-color: #fff;
                        background-origin: border-box;
                        border-width: 1px;
                        border-color: #6b7280;
                        padding: 0;
                        display: inline-block;
                    }
                    input[type="checkbox"]:checked:hover,
                    input[type="checkbox"]:checked:focus {
                        background-color: currentColor;
                        border-color: #0000;
                    }
                    input[type="checkbox"]:checked {
                        background-color: currentColor;
                        background-position: 50%;
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        border-color: #0000;
                        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
                    }
                    input[type="checkbox"]:focus {
                        outline-offset: 2px;
                    }
                    input[type="checkbox"]:focus + span {
                        box-shadow: var(--color-brand) 0px 0px 1px;
                    }
                    input[type="checkbox"]:checked + span {
                        background-color: var(--color-brand);
                    }
                    > span {
                        position: absolute;
                        cursor: pointer;
                        background-color: rgba(255, 255, 255, 0.2);
                        border-radius: 16px;
                        transition: background-color 0.2s;
                        inset: 0px;
                        &::before {
                            position: absolute;
                            content: "";
                            height: 12px;
                            width: 12px;
                            left: 2px;
                            bottom: 2px;
                            background-color: rgb(255, 255, 255);
                            border-radius: 50%;
                            transition: transform 0.2s;
                        }
                    }
                    input[type="checkbox"]:checked + span::before {
                        transform: translateX(12px);
                    }
                }
            }
        }
    }
}
.link-edit-menu {
    z-index: 10;
    visibility: visible;
    position: absolute;
    margin: 0px;
    border: 0 solid #e5e7eb;
    max-width: 350px;
    transition: 0s;
    > div {
        background: rgb(39, 42, 47);
        border-radius: 8px;
        display: inline-flex;
        flex-flow: wrap;
        line-height: 1;
        padding: 0.25rem;
        > div {
            margin-left: 0.125rem;
            margin-top: 0px;
            display: flex;
            min-width: 18rem;
            > span {
                align-self: center;
                color: var(--color-brand);
                line-height: 0;
                margin-left: 0.375rem;
                > span {
                    display: inline-block;
                    height: 1rem;
                    width: 1rem;
                    svg {
                        display: block;
                        height: 100%;
                        width: 100%;
                    }
                }
            }
            > a {
                align-self: center;
                color: var(--color-brand);
                flex: 1 1 0%;
                font-size: 0.875rem;
                font-weight: 500;
                line-height: 1;
                margin-left: 0.5rem;
                margin-right: 0.5rem;
                max-width: 25rem;
                overflow: hidden;
                text-decoration: underline;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            > div button {
                align-items: center;
                background: 0px center;
                border: 0px;
                border-radius: 8px;
                display: inline-flex;
                font-weight: 500;
                line-height: 1.2;
                text-align: left;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.875rem;
                padding: 0.3125rem;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: rgb(255, 255, 255);
                }
            }
            input {
                background: transparent;
                border: 0px;
                caret-color: var(--color-brand);
                color: #fff;
                flex: 1 1 0%;
                font-size: 0.875rem;
                font-weight: 500;
                height: 100%;
                line-height: 1;
                outline: 0px;
                max-width: 25rem;
                padding: 0px 0.5rem;
                min-height: unset;
                &:focus {
                    border: 0px;
                    box-shadow: none;
                    color: #fff;
                }
            }
            > button {
                align-items: center;
                background: 0px center;
                border: 0px;
                border-radius: 8px;
                display: inline-flex;
                font-weight: 500;
                line-height: 1.2;
                text-align: left;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.875rem;
                padding: 0.3125rem;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: rgb(255, 255, 255);
                }
            }
        }
        > div:first-child {
            margin-left: 0px;
            margin-top: 0px;
        }
    }

    .link-settings {
        z-index: 9999;
        position: absolute;
        inset: auto auto 0px 0px;
        margin: 0px;
        transform: translate3d(194px, -37.6px, 0px);
        background: rgb(39, 42, 47);
        border-radius: 8px;
        display: inline-flex;
        flex-flow: wrap;
        line-height: 1;
        padding: 0.25rem;
        > label {
            align-items: center;
            cursor: pointer;
            display: flex;
            gap: 0.5rem;
            justify-content: space-between;
            line-height: 1.15;
            opacity: 1;
            padding: 0.375rem;
            > div {
                align-items: center;
                color: rgba(255, 255, 255, 0.8);
                display: flex;
                flex: 1 1 0%;
                font-size: 0.875rem;
                font-weight: 500;
                gap: 0.5rem;
            }
            > label {
                display: inline-block;
                height: 16px;
                position: relative;
                width: 28px;
                background-color: transparent;
                border-radius: 0px;
                padding: 0px;
                cursor: default;
                input[type="checkbox"] {
                    opacity: 0;
                    width: 0px;
                    height: 0px;
                    position: absolute;
                    border-radius: 0;
                    appearance: none;
                    user-select: none;
                    color: #2563eb;
                    print-color-adjust: exact;
                    background-color: #fff;
                    background-origin: border-box;
                    border-width: 1px;
                    border-color: #6b7280;
                    padding: 0;
                    display: inline-block;
                }
                input[type="checkbox"]:checked:hover,
                input[type="checkbox"]:checked:focus {
                    background-color: currentColor;
                    border-color: #0000;
                }
                input[type="checkbox"]:checked {
                    background-color: currentColor;
                    background-position: 50%;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    border-color: #0000;
                    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
                }
                input[type="checkbox"]:focus {
                    outline-offset: 2px;
                }
                input[type="checkbox"]:focus + span {
                    box-shadow: var(--color-brand) 0px 0px 1px;
                }
                input[type="checkbox"]:checked + span {
                    background-color: var(--color-brand);
                }
                > span {
                    position: absolute;
                    cursor: pointer;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 16px;
                    transition: background-color 0.2s;
                    inset: 0px;
                    &::before {
                        position: absolute;
                        content: "";
                        height: 12px;
                        width: 12px;
                        left: 2px;
                        bottom: 2px;
                        background-color: rgb(255, 255, 255);
                        border-radius: 50%;
                        transition: transform 0.2s;
                    }
                }
                input[type="checkbox"]:checked + span::before {
                    transform: translateX(12px);
                }
            }
        }
    }
    .divider {
        margin-left: 0.25rem;
        margin-right: 0.125rem;
        height: auto;
        width: 1px;
        background: rgba(255, 255, 255, 0.1);
    }
}
.slash-menu {
    position: absolute;
    z-index: 20;
    background: rgb(39, 42, 47);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    padding: 0.25rem;
    min-width: 220px;
    max-height: 260px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0);
}

.slash-category {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    opacity: 0.75;
}
.slash-item {
    display: flex;
    width: 100%;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 20ms ease-in;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: rgb(255, 255, 255);
    }
    &.is-active {
        background-color: rgba(255, 255, 255, 0.1);
        color: rgb(255, 255, 255);
    }
    > div {
        display: flex;
        align-items: center;
        gap: 8px;
        line-height: 120%;
        width: 100%;
        min-height: 28px;
        font-size: 14px;
        padding-inline: 8px;

        .slash-item__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 20px;
            min-height: 20px;

            svg {
                width: 20px;
                height: 20px;
                display: block;
                flex-shrink: 0;
            }
        }
        .slash-item__name {
            margin-inline: 0px;
            min-width: 0px;
            flex: 1 1 auto;
            height: 32px;
            display: flex;
            align-items: center;
            >div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                >div {
                    display: flex;
                    align-items: center;
                    
                    span {
                        margin-inline-end: 6px;
                    }
                }
            }
        }
        .slash-item__shortcut {
            margin-inline-start: auto;
            min-width: 0px;
            flex-shrink: 0;

            span {
                color: #7d7a75;
                font-size: 12px;
                white-space: nowrap;
                padding-inline-end: 2px
            }
        }
    }
}
.ProseMirror-selectednode,
.ProseMirror-selectednoderange {
    position: relative;

    &::before {
        position: absolute;
        pointer-events: none;
        z-index: -1;
        content: "";
        top: -0.25rem;
        left: -0.25rem;
        right: -0.25rem;
        bottom: -0.25rem;
        background-color: #70cff850;
        border-radius: 0.2rem;
    }
}
.drag-toolbar {
    button {
        align-items: center;
        background: 0px center;
        border: 0px;
        border-radius: 8px;
        display: inline-flex;
        font-weight: 500;
        line-height: 1.2;
        text-align: left;
        text-decoration: none;
        color: rgb(39, 42, 47);
        font-size: 0.875rem;
        padding: 0.3125rem;
        &:hover {
            background-color: rgba(39, 42, 47, 0.06);
        }
        span {
            margin-left: 0px;
            margin-right: 0px;
            display: inline-block;
            height: 1rem !important;
            width: 1rem !important;

            svg {
                display: block;
                height: 100% !important;
                width: 100% !important;
            }
        }
    }
}
</style>
