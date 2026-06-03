<template>
    <div>
        <Modal
            ref="modal_edit_entity"
            :header="editIndex === -1 ? 'Upload entity' : 'Edit entity'"
        >
            <div class="modal-entity universal-labels">
                <div class="item-file-input">
                    <div class="file-header">
                        <IconPhoto aria-hidden="true" />
                        <strong>
                            {{ editFile ? editFile.name : "Current image" }}
                        </strong>
                        <FileInput
                            v-if="editIndex === -1"
                            class="iconified-button raised-button"
                            prompt="Replace"
                            accept="image/png,.png"
                            should-always-reset
                            aria-label="Replace item image"
                            @change="
                                (x) => {
                                    editFile = x[0];
                                    showPreviewImage();
                                }
                            "
                        >
                            <IconReplace aria-hidden="true" />
                        </FileInput>
                    </div>
                    <img
                        :src="
                            previewImage && typeof previewImage === 'string'
                                ? previewImage
                                : `data:image/png;base64,${entities[editIndex].icon}`
                        "
                        alt="entity-preview"
                    />
                </div>
                <label for="entity-label">
                    <span class="label__title">Label</span>
                </label>
                <input
                    id="entity-title"
                    v-model="editLabel"
                    type="text"
                    maxlength="64"
                    placeholder="Enter label..."
                />
                <label for="entity-name">
                    <span class="label__title">Id</span>
                </label>
                <input
                    id="entity-name"
                    v-model="editName"
                    type="text"
                    maxlength="64"
                    placeholder="Enter id..."
                />
                <div class="button-group">
                    <button
                        class="iconified-button"
                        @click="modal_edit_entity?.hide()"
                    >
                        <IconX aria-hidden="true" />
                        Cancel
                    </button>
                    <button
                        v-if="editIndex === -1"
                        class="iconified-button brand-button"
                        :disabled="shouldPreventActions"
                        @click="createEntity"
                    >
                        <IconPlus aria-hidden="true" />
                        Add entity
                    </button>
                    <button
                        v-else
                        class="iconified-button brand-button"
                        :disabled="shouldPreventActions"
                        @click="editEntity"
                    >
                        <IconDeviceFloppy aria-hidden="true" />
                        Save changes
                    </button>
                </div>
            </div>
        </Modal>
        <section class="universal-card">
            <h2 class="text-2xl">Minecraft entities</h2>
            <div class="search-row">
                <div class="iconified-input">
                    <label for="search-input" hidden
                        >Search minecraft entities</label
                    >
                    <IconSearch aria-hidden="true" />
                    <input
                        type="text"
                        id="search-input"
                        v-model="filterQuery"
                    />
                    <Button
                        v-if="filterQuery"
                        class="r-btn"
                        aria-label="Clear search"
                        @click="() => (filterQuery = '')"
                    >
                        <IconX aria-hidden="true" />
                    </Button>
                </div>
                <FileInput
                    class="iconified-button brand-button"
                    accept="image/png,.png"
                    prompt="Upload an entity"
                    aria-label="Upload an entity"
                    @change="handleFiles"
                >
                    <IconUpload aria-hidden="true" />
                </FileInput>
                <DropArea accept="image/png,.png" @change="handleFiles" />
            </div>
            <p></p>
            <div class="grid-table">
                <div class="grid-table__row grid-table__header">
                    <div>Icon</div>
                    <div>Label</div>
                    <div>ID</div>
                    <div />
                </div>
                <div
                    v-for="(entity, index) in orderedEntities"
                    :key="`entity-${entity.name}`"
                    class="grid-table__row"
                >
                    <div>
                        <Avatar
                            :src="`data:image/png;base64,${entity.icon}`"
                            aria-hidden="true"
                            :alt="'Icon for ' + entity.label"
                            no-shadow
                            loading="lazy"
                        />
                    </div>
                    <div>
                        <span class="entity-label wrap-as-needed">
                            {{ entity.label }}
                        </span>
                    </div>
                    <div>
                        <CopyCode :text="entity.name" />
                    </div>
                    <div>
                        <button
                            class="square-button"
                            @click="
                                () => {
                                    resetEdit();
                                    editIndex = index;
                                    editLabel = entity.label;
                                    editName = entity.name;
                                    modal_edit_entity?.show();
                                }
                            "
                        >
                            <IconEdit />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import {
    IconDeviceFloppy,
    IconEdit,
    IconPhoto,
    IconPlus,
    IconReplace,
    IconSearch,
    IconSettings,
    IconTransfer,
    IconUpload,
    IconX,
} from "@tabler/icons-vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import Avatar from "~/components/ui/Avatar.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import CopyCode from "~/components/ui/CopyCode.vue";
import Button from "~/components/modrinth/ui/base/Button.vue";
import FileInput from "~/components/ui/FileInput.vue";
import DropArea from "~/components/ui/DropArea.vue";
import Modal from "~/components/ui/Modal.vue";

useHead({
    title: "Entity database - Vanilla Tyme",
});
const filterQuery = ref("");
const editIndex = ref(-1);
const editFile = ref<File | null>(null);
const editLabel = ref("");
const editName = ref("");
const previewImage = ref<string | ArrayBuffer | null>(null);
const modal_edit_entity = ref<InstanceType<typeof Modal> | null>(null);
const shouldPreventActions = ref(false);
interface Entity {
    name: string;
    label: string;
    icon: string;
}

const entities =
    ((await useBaseFetch("data/entities", {
        method: "GET",
    })) as Entity[]) || [];

const orderedEntities = computed(() => {
    if (!entities) return [];
    return entities.filter((entity) => {
        if (!filterQuery.value) return true;
        return (
            entity.name
                .toLowerCase()
                .includes(filterQuery.value.toLowerCase()) ||
            entity.label.toLowerCase().includes(filterQuery.value.toLowerCase())
        );
    });
});
const resetEdit = () => {
    editLabel.value = "";
    editName.value = "";
    editIndex.value = -1;
    editFile.value = null;
    previewImage.value = null;
};
const handleFiles = async (files: File[]) => {
    resetEdit();
    editFile.value = files[0];
    showPreviewImage();
    modal_edit_entity.value?.show();
};
const showPreviewImage = () => {
    const reader = new FileReader();
    if (editFile.value instanceof Blob) {
        reader.readAsDataURL(editFile.value);
        reader.onload = (event) => {
            previewImage.value = event.target?.result ?? null;
        };
    }
};
</script>

<style lang="scss" scoped>
.grid-table {
    display: grid;
    grid-template-columns:
        min-content minmax(min-content, 1fr)
        minmax(min-content, 1fr)
        min-content;
    border-radius: var(--size-rounded-sm);
    overflow: hidden;
    margin-top: var(--spacing-card-md);
    outline: 1px solid transparent;

    .grid-table__row {
        display: contents;

        > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: var(--spacing-card-sm);

            // Left edge of table
            &:first-child {
                padding-left: var(--spacing-card-bg);
            }

            // Right edge of table
            &:last-child {
                padding-right: var(--spacing-card-bg);
            }
        }

        &:nth-child(2n + 1) > div {
            background-color: var(--color-table-alternate-row);
        }

        &.grid-table__header > div {
            background-color: var(--color-bg);
            font-weight: bold;
            color: var(--color-text-dark);
            padding-top: var(--spacing-card-bg);
            padding-bottom: var(--spacing-card-bg);
        }
    }

    @media screen and (max-width: 750px) {
        display: flex;
        flex-direction: column;

        .grid-table__row {
            display: grid;
            grid-template: "icon label id settings";
            grid-template-columns:
                min-content minmax(min-content, 2fr)
                minmax(min-content, 1fr) min-content;

            :nth-child(1) {
                grid-area: icon;
            }

            :nth-child(2) {
                grid-area: label;
            }

            :nth-child(3) {
                grid-area: id;
                padding-top: 0;
            }

            :nth-child(4) {
                grid-area: settings;
            }
        }

        .grid-table__header {
            grid-template: "settings";
            grid-template-columns: minmax(min-content, 1fr);

            :nth-child(1),
            :nth-child(2),
            :nth-child(3) {
                display: none;
            }
        }
    }

    @media screen and (max-width: 560px) {
        .grid-table__row {
            display: grid;
            grid-template: "icon label settings";
            grid-template-columns:
                min-content minmax(min-content, 1fr)
                min-content;
            :nth-child(3) {
                display: none !important;
            }
            :nth-child(4) {
                padding-top: 0;
            }
        }

        .grid-table__header {
            grid-template: "settings";
            grid-template-columns: minmax(min-content, 1fr);
        }
    }
}

.entity-label {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-card-xs);

    svg {
        color: var(--color-orange);
    }
}

.hover-link:hover {
    text-decoration: underline;
}

.labeled-control-row {
    flex: 1;
    display: flex;
    flex-direction: row;
    min-width: 0;
    align-items: center;
    gap: var(--spacing-card-md);
    white-space: nowrap;
}

.small-select {
    width: -moz-fit-content;
    width: fit-content;
}

.label-button[data-active="true"] {
    --background-color: var(--color-red);
    --text-color: var(--color-brand-inverted);
}

.links-modal {
    .links {
        display: grid;
        gap: var(--spacing-card-sm);
        grid-template-columns: 1fr 2fr;

        .input-group {
            flex-wrap: nowrap;
        }

        @media screen and (max-width: 530px) {
            grid-template-columns: 1fr;
            .input-group {
                flex-wrap: wrap;
            }
        }
    }

    ul {
        margin: 0 0 var(--spacing-card-sm) 0;
    }
}
.search-row {
    margin-bottom: var(--gap-lg);
    display: flex;
    align-items: center;
    gap: var(--gap-lg) var(--gap-sm);
    flex-wrap: wrap;
    justify-content: center;

    .iconified-input {
        flex-grow: 1;

        input {
            height: 2rem;
        }
    }
}
.modal-entity {
    padding: var(--spacing-card-bg);
    display: flex;
    flex-direction: column;

    .item-file-input {
        .file-header {
            border-radius: var(--size-rounded-card) var(--size-rounded-card) 0 0;

            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: var(--color-button-bg);
            padding: var(--spacing-card-md);

            svg {
                min-width: 1rem;
            }
            strong {
                word-wrap: anywhere;
            }

            .iconified-button {
                margin-left: auto;
            }
        }

        img {
            border-radius: 0 0 var(--size-rounded-card) var(--size-rounded-card);
            width: 100%;
            height: auto;
            max-height: 15rem;
            object-fit: contain;
            background-color: #000000;
        }
    }
}
</style>
