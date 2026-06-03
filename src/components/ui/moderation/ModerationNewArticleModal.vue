<template>
    <NewModal ref="modal" header="Choose a template">
        <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-2">
                <div class="template-lists">
                    <div class="template-layouts">
                        <button
                            class="preview-radio button-base"
                            :class="{
                                selected: templateSelected === 'emptyDraft',
                            }"
                            @click="() => (templateSelected = 'emptyDraft')"
                        >
                            <div class="preview">
                                <div class="example-card card">
                                    <div class="example-text-0"></div>
                                    <div class="example-icon"></div>
                                    <div class="example-text-1"></div>
                                    <div
                                        class="example-thumbnail thumbnail"
                                    ></div>
                                    <div class="example-text-2"></div>
                                    <div class="example-text-3"></div>
                                </div>
                            </div>
                            <div class="label">
                                <IconCircleDot
                                    v-if="templateSelected === 'emptyDraft'"
                                    class="radio"
                                />
                                <IconCircle v-else class="radio" />
                                Blank Draft
                            </div>
                        </button>
                    </div>
                </div>
                <p class="m-0 max-w-[30rem]">
                    Your new collection will be created as a public collection
                    with.
                </p>
                <div class="flex justify-end gap-2">
                    <ButtonStyled>
                        <button @click="cancel">
                            <IconX aria-hidden="true" />
                            Cancel
                        </button>
                    </ButtonStyled>
                    <ButtonStyled color="brand">
                        <button @click="createArticle">
                            <IconWriting aria-hidden="true" />
                            Write article
                        </button>
                    </ButtonStyled>
                </div>
            </div>
        </div>
    </NewModal>
</template>

<script setup>
import NewModal from "~/components/modrinth/ui/modal/NewModal.vue";
import {
    IconX,
    IconTrash,
    IconCircleDot,
    IconCircle,
    IconWriting,
} from "@tabler/icons-vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
const app = useNuxtApp();
const router = useRouter();

const modal = ref();
const props = defineProps({
    currentTemplate: {
        type: String,
        default: "emptyDraft",
        required: true,
    },
    templateOptions: {
        type: Array,
        required: true,
    },
});

let templateSelected = ref(props.currentTemplate);

function show(event) {
    currentTemplate.value = "emptyDraft";
    modal.value.show(event);
}
function cancel(event) {
    modal.value.hide(event);
}

async function createArticle() {
    startLoading();

    const auth = await useAuth();
    try {
        const article = await useBaseFetch("moderation/news/article", {
            method: "POST",
            body: {
                template: templateSelected.value || "emptyDraft",
            },
        });
        modal.value.hide();
        await router.push({
            path: `/moderation/news/article/${article.articleId}/edit`,
        });
    } catch (err) {
        app.$notify({
            group: "main",
            title: "An error occurred",
            text: err,
            type: "error",
        });
    }
}

defineExpose({
    show,
});
</script>

<style scoped lang="scss">
.modal-creation {
    input {
        width: 20rem;
        max-width: 100%;
    }

    .text-input-wrapper {
        width: 100%;
    }

    textarea {
        min-height: 5rem;
    }

    .input-group {
        margin-top: var(--gap-md);
    }
}
.template-lists {
    display: flex;
    gap: var(--gap-md);
    .template-layouts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
        gap: var(--gap-lg);
        width: 100%;
        .preview-radio.selected .preview .example-card .thumbnail {
            background-color: var(--color-brand-highlight);
            border: 2px solid var(--color-brand);
        }
        .preview .example-card {
            margin: 0;
            padding: 1rem;
            display: grid;
            grid-template: "text0 text0" "icon text1" "thumbnail thumbnail" "text2 text2" "text3 text3";
            grid-template-columns: auto 1fr;
            gap: 0.5rem;
            outline: 2px solid transparent;
            .example-icon {
                grid-area: icon;
                width: 0.5rem;
                height: 0.5rem;
                background-color: var(--color-button-bg);
                border-radius: var(--radius-sm);
                outline: 2px solid transparent;
            }
            .example-thumbnail {
                grid-area: thumbnail;
                height: 3rem;
                border-radius: var(--radius-sm);
                background-color: var(--color-button-bg);
            }
            .example-text-0,
            .example-text-1,
            .example-text-2,
            .example-text-3 {
                height: 0.5rem;
                border-radius: var(--radius-sm);
                outline: 2px solid transparent;
            }

            .example-text-0 {
                grid-area: text0;
                width: 60%;
                background-color: var(--color-base);
            }
            .example-text-1 {
                grid-area: text1;
                width: 20%;
                background-color: var(--color-base);
            }

            .example-text-2 {
                grid-area: text2;
                width: 100%;
                background-color: var(--color-secondary);
            }
            .example-text-3 {
                grid-area: text3;
                width: 100%;
                background-color: var(--color-secondary);
            }
        }
    }
}
</style>
