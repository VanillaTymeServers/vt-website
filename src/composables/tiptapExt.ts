export { BubbleMenu as tiptapBubbleMenu } from "@tiptap/extension-bubble-menu";
export { CharacterCount as tiptapCharacterCount } from "@tiptap/extensions";
import Highlight from "@tiptap/extension-highlight";
export const tiptapHighlight = Highlight.extend({
    addAttributes() {
        return {
            color: {
                default: null,
                parseHTML: (element) =>
                    element.getAttribute("data-highlight-color") ||
                    (element as HTMLElement).style.backgroundColor ||
                    null,
                renderHTML: (attributes) => {
                    if (!attributes.color) {
                        return {};
                    }

                    return {
                        "data-highlight-color": attributes.color,
                        style: `background-color: ${attributes.color}`,
                    };
                },
            },
        };
    },
}).configure({
    multicolor: true,
});
export { Strike as tiptapStrike } from "@tiptap/extension-strike";
export { Link as tiptapLink } from "@tiptap/extension-link";
export { Code as tiptapCode } from "@tiptap/extension-code";
export { Superscript as tiptapSuperscript } from "@tiptap/extension-superscript";
export { Subscript as tiptapSubscript } from "@tiptap/extension-subscript";
import { TaskList, TaskItem } from "@tiptap/extension-list";

export const tiptapTaskList = TaskList.configure({
    
});

export const tiptapTaskItem = TaskItem.configure({
    nested: true,
});

export { CodeBlockLowlight as tiptapCodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
export { TextAlign as tiptapTextAlign } from "@tiptap/extension-text-align";
export { Typography as tiptapTypography } from "@tiptap/extension-typography";
export { Youtube as tiptapYoutube } from "@tiptap/extension-youtube";
export { Placeholder as tiptapPlaceholder } from "@tiptap/extensions";
export { Focus as tiptapFocus } from "@tiptap/extensions";
export { Suggestion as tiptapSuggestion } from "@tiptap/suggestion";
export { DragHandle as tiptapDragHandle } from "@tiptap/extension-drag-handle-vue-3";
export { NodeRange as tiptapNodeRange } from "@tiptap/extension-node-range";