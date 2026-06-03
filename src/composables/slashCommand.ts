import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

export type SlashItem = {
    title: string;
    category: "Basic" | "Headings" | "Media";
    icon: string;
    shortcut?: string;
    command: (ctx: {
        editor: any;
        range: { from: number; to: number };
    }) => void;
};

export const SlashCommand = Extension.create({
    name: "slashCommand",

    addOptions() {
        return {
            // you will pass these callbacks from TipTapEditor.vue
            onOpen: (_: {
                items: SlashItem[];
                query: string;
                clientRect: DOMRect | null;
                range: { from: number; to: number };
            }) => {},
            onUpdate: (_: {
                items: SlashItem[];
                query: string;
                clientRect: DOMRect | null;
                range: { from: number; to: number };
            }) => {},
            onClose: () => {},
            onKeyDown: (_: {
                event: KeyboardEvent;
                items: SlashItem[];
                command: (item: SlashItem) => void;
            }) => false,

            suggestion: {
                char: "/",
                startOfLine: false, // set true if you only want "/..." at start of line
                allowSpaces: false,
            },
        };
    },

    addProseMirrorPlugins() {
        const editor = this.editor;

        const getItems = (query: string): SlashItem[] => {
            const q = query.toLowerCase();

            const items: SlashItem[] = [
                {
                    title: "Bullet list",
                    category: "Basic",
                    icon: "List",
                    shortcut: "-",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleBulletList()
                            .run(),
                },
                {
                    title: "Numbered list",
                    category: "Basic",
                    icon: "ListOrdered",
                    shortcut: "1.",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleOrderedList()
                            .run(),
                },
                {
                    title: "Task list",
                    category: "Basic",
                    icon: "ListTodo",
                    shortcut: "[]",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleTaskList()
                            .run(),
                },
                {
                    title: "Blockquote",
                    category: "Basic",
                    icon: "TextQuote",
                    shortcut: ">",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleBlockquote()
                            .run(),
                },
                {
                    title: "Code block",
                    category: "Basic",
                    icon: "SquareCode",
                    shortcut: "```",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleCodeBlock()
                            .run(),
                },
                {
                    title: "Horizontal rule",
                    category: "Basic",
                    icon: "Minus",
                    shortcut: "---",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .setHorizontalRule()
                            .run(),
                },
                {
                    title: "Heading 1",
                    category: "Headings",
                    icon: "Heading1",
                    shortcut: "#",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 1 })
                            .run(),
                },
                {
                    title: "Heading 2",
                    category: "Headings",
                    icon: "Heading2",
                    shortcut: "##",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 2 })
                            .run(),
                },
                {
                    title: "Heading 3",
                    category: "Headings",
                    icon: "Heading3",
                    shortcut: "###",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 3 })
                            .run(),
                },
                {
                    title: "Heading 4",
                    category: "Headings",
                    icon: "Heading4",
                    shortcut: "####",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 4 })
                            .run(),
                },
                {
                    title: "Heading 5",
                    category: "Headings",
                    icon: "Heading5",
                    shortcut: "#####",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 5 })
                            .run(),
                },
                {
                    title: "Heading 6",
                    category: "Headings",
                    icon: "Heading6",
                    shortcut: "######",
                    command: ({ editor, range }) =>
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .toggleHeading({ level: 6 })
                            .run(),
                },
                {
                    title: "YouTube",
                    category: "Media",
                    icon: "IconBrandYoutubeFilled",
                    shortcut: "yt",
                    command: ({ editor, range }) => {
                        const url = window.prompt("YouTube URL");
                        if (!url) return;

                        // Only works if the YouTube extension is installed.
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .setYoutubeVideo({ src: url })
                            .run();
                    },
                },
            ];

            return items
                .filter((i) => {
                    if (!q) return true;
                    return (
                        i.title.toLowerCase().includes(q) ||
                        i.category.toLowerCase().includes(q) ||
                        i.shortcut?.toLowerCase().includes(q)
                    );
                });
        };

        return [
            Suggestion({
                editor,
                ...this.options.suggestion,

                items: ({ query }) => getItems(query),

                command: ({ editor, range, props }) => {
                    // `props` is the selected SlashItem
                    props.command({ editor, range });
                    this.options.onClose();
                },

                render: () => {
                    let currentItems: SlashItem[] = [];
                    return {
                        onStart: (props) => {
                            currentItems = props.items as SlashItem[];
                            this.options.onOpen({
                                items: currentItems,
                                query: props.query,
                                clientRect: props.clientRect?.() ?? null,
                                range: props.range,
                            });
                        },
                        onUpdate: (props) => {
                            currentItems = props.items as SlashItem[];
                            this.options.onUpdate({
                                items: currentItems,
                                query: props.query,
                                clientRect: props.clientRect?.() ?? null,
                                range: props.range,
                            });
                        },
                        onExit: () => {
                            this.options.onClose();
                        },
                        onKeyDown: (props) => {
                            return this.options.onKeyDown({
                                event: props.event,
                                items: currentItems,
                                command: (item) => item.command({ editor, range: props.range })
                            });
                        },
                    };
                },
            }),
        ];
    },
});
