<template>
    <div>
        <ModalConfirm
            ref="modal_confirm"
            title="Are you sure you want to delete this shop?"
            description="If you proceed, all versions and any attached data will be removed from our servers."
            :has-to-type="true"
            :confirmation-text="project.title"
            proceed-label="Delete"
            @proceed="deleteProject"
        />
        <section class="universal-card">
            <div class="label">
                <h3>
                    <span class="label__title size-card-header"
                        >Shop information</span
                    >
                </h3>
            </div>
            <label for="project-icon">
                <span class="label__title">Icon</span>
            </label>
            <div class="input-group">
                <Avatar
                    :src="
                        deletedIcon
                            ? null
                            : previewImage
                              ? previewImage
                              : project.icon_url
                    "
                    :alt="project.title"
                    size="md"
                    class="project__icon"
                />
                <div class="input-stack">
                    <FileInput
                        id="project-icon"
                        :max-size="5242880"
                        :show-icon="true"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        class="choose-image iconified-button"
                        prompt="Upload icon"
                        aria-label="Upload icon"
                        :disabled="!hasPermission"
                        @change="showPreviewImage"
                    >
                        <IconUpload aria-hidden="true" />
                    </FileInput>
                    <button
                        v-if="
                            !deletedIcon && (previewImage || project.icon_url)
                        "
                        class="iconified-button"
                        :disabled="!hasPermission"
                        @click="markIconForDeletion"
                    >
                        <IconTrash aria-hidden="true" />
                        Remove icon
                    </button>
                </div>
            </div>

            <label for="project-name">
                <span class="label__title">Name</span>
            </label>
            <input
                id="project-name"
                v-model="name"
                maxlength="2048"
                type="text"
                :disabled="!hasPermission"
            />

            <label for="project-slug">
                <span class="label__title">URL</span>
            </label>
            <div class="text-input-wrapper">
                <div class="text-input-wrapper__before">
                    https://vanillatyme.com/{{
                        $getProjectTypeForUrl(
                            project.project_type,
                            project.loaders,
                        )
                    }}/
                </div>
                <input
                    id="project-slug"
                    v-model="slug"
                    type="text"
                    maxlength="64"
                    autocomplete="off"
                    :disabled="!hasPermission"
                />
            </div>

            <label for="project-summary">
                <span class="label__title">Summary</span>
            </label>
            <div class="textarea-wrapper summary-input">
                <textarea
                    id="project-summary"
                    v-model="summary"
                    maxlength="256"
                    :disabled="!hasPermission"
                />
            </div>
            <div class="adjacent-input">
                <label for="project-env">
                    <span class="label__title">Shop type</span>
                    <span class="label__description">
                        Select based on if your shop is a stall or a shop.
                    </span>
                </label>
                <Multiselect
                    id="project-env"
                    v-model="stall"
                    class="small-multiselect"
                    placeholder="Select one"
                    :options="shopTypes"
                    :custom-label="
                        (value) =>
                            value.charAt(0).toUpperCase() + value.slice(1)
                    "
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    :allow-empty="false"
                    :disabled="!hasPermission"
                />
            </div>
            <div v-if="stall === 'stall'" class="adjacent-input">
                <label for="project-stall-color">
                    <span class="label__title">Stall color</span>
                    <span class="label__description">
                        Select the color for your stall. Each stall has a
                        different color roof to help players identify them.
                    </span>
                </label>
                <Multiselect
                    id="project-stall-color"
                    v-model="stallColor"
                    class="small-multiselect"
                    placeholder="Select one"
                    :options="stallColors"
                    :custom-label="
                        (value) =>
                            value.charAt(0).toUpperCase() + value.slice(1)
                    "
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    :allow-empty="false"
                    :disabled="!hasPermission"
                />
            </div>
            <div v-else class="adjacent-input">
                <label for="project-coordinates">
                    <span class="label__title">Coordinates</span>
                    <span class="label__description">
                        Enter the coordinates of your shop in the format x, z.
                        Try to get the coordinates close to your shop's main
                        entrance.
                    </span>
                </label>
                <div class="input-stack">
                    <div class="text-input-wrapper">
                        <div class="text-input-wrapper__before">
                            <IconLetterX aria-hidden="true" />
                        </div>
                        <input
                            type="number"
                            class="!pl-2"
                            name="x-coord"
                            v-model="coordX"
                            :disabled="!hasPermission"
                            min="-750"
                            max="750"
                        />
                    </div>
                    <div class="text-input-wrapper">
                        <div class="text-input-wrapper__before">
                            <IconLetterZ aria-hidden="true" />
                        </div>
                        <input
                            type="number"
                            class="!pl-2"
                            name="x-coord"
                            v-model="coordZ"
                            :disabled="!hasPermission"
                            min="-750"
                            max="750"
                        />
                    </div>
                </div>
            </div>
            <div class="adjacent-input">
                <label for="project-visibility">
                    <span class="label__title">Visibility</span>
                    <div class="label__description">
                        Public and archived shops are visible in search.
                        Unlisted shops are published, but not visible in search
                        or on user profiles. Private shops are only accessible
                        by members of the shop.

                        <p>If approved by the moderators:</p>
                        <ul class="visibility-info">
                            <li>
                                <IconCheck
                                    v-if="
                                        visibility === 'approved' ||
                                        visibility === 'archived'
                                    "
                                    class="good"
                                />
                                <IconX v-else class="bad" />
                                {{
                                    hasModifiedVisibility() ? "Will be v" : "V"
                                }}isible in search
                            </li>
                            <li>
                                <IconX
                                    v-if="
                                        visibility === 'unlisted' ||
                                        visibility === 'private'
                                    "
                                    class="bad"
                                />
                                <IconCheck v-else class="good" />
                                {{
                                    hasModifiedVisibility() ? "Will be v" : "V"
                                }}isible on profile
                            </li>
                            <li>
                                <IconCheck
                                    v-if="visibility !== 'private'"
                                    class="good"
                                />
                                <IconAlertTriangle
                                    v-else
                                    v-tooltip="{
                                        content:
                                            visibility === 'private'
                                                ? 'Only members will be able to view the shop.'
                                                : '',
                                    }"
                                    class="warn"
                                />
                                {{
                                    hasModifiedVisibility() ? "Will be v" : "V"
                                }}isible via URL
                            </li>
                        </ul>
                    </div>
                </label>
                <Multiselect
                    id="project-visibility"
                    v-model="visibility"
                    class="small-multiselect"
                    placeholder="Select one"
                    :options="tags.approvedStatuses"
                    :custom-label="(value) => formatProjectStatus(value)"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    :allow-empty="false"
                    :disabled="!hasPermission"
                />
            </div>
            <div class="button-group">
                <button
                    type="button"
                    class="iconified-button brand-button"
                    :disabled="!hasChanges"
                    @click="saveChanges()"
                >
                    <IconDeviceFloppy aria-hidden="true" />
                    Save changes
                </button>
            </div>
        </section>

        <section class="universal-card">
            <div class="label">
                <h3>
                    <span class="label__title size-card-header"
                        >Delete shop</span
                    >
                </h3>
            </div>
            <p>
                Removes your shop from Vanilla Tyme's website and search.
                Clicking on this will delete your shop, so be extra careful!
            </p>
            <button
                type="button"
                class="iconified-button danger-button"
                :disabled="!hasDeletePermission"
                @click="$refs.modal_confirm.show()"
            >
                <IconTrash aria-hidden="true" />
                Delete shop
            </button>
        </section>
    </div>
</template>

<script setup>
import { Multiselect } from "vue-multiselect";

import { formatProjectStatus } from "~/utils/utils";
import Avatar from "~/components/ui/Avatar.vue";
import ModalConfirm from "~/components/ui/ModalConfirm.vue";
import FileInput from "~/components/ui/FileInput.vue";

import {
    IconUpload,
    IconDeviceFloppy,
    IconTrash,
    IconX,
    IconAlertTriangle,
    IconCheck,
    IconLetterX,
    IconLetterZ,
} from "@tabler/icons-vue";

import { stallColors } from "~/utils/utils";

const props = defineProps({
    project: {
        type: Object,
        required: true,
        default: () => ({}),
    },
    currentMember: {
        type: Object,
        required: true,
        default: () => ({}),
    },
    patchProject: {
        type: Function,
        required: true,
        default: () => {},
    },
    patchIcon: {
        type: Function,
        required: true,
        default: () => {},
    },
    resetProject: {
        type: Function,
        required: true,
        default: () => {},
    },
});

const tags = useTags();
const router = useNativeRouter();

const name = ref(props.project.title);
const slug = ref(props.project.slug);
const summary = ref(props.project.description);
const icon = ref(null);
const previewImage = ref(null);
const clientSide = ref(props.project.client_side);
const serverSide = ref(props.project.server_side);
const stall = ref(props.project.stall ? "stall" : "shop");
const stallColor = ref(props.project.stall_color);
const coordX = ref(props.project.coordinates.x);
const coordZ = ref(props.project.coordinates.z);
const deletedIcon = ref(false);
const visibility = ref(
    tags.value.approvedStatuses.includes(props.project.status)
        ? props.project.status
        : props.project.requested_status,
);

const hasPermission = computed(() => {
    return props.currentMember.permissions.EDIT_DETAILS;
});

const hasDeletePermission = computed(() => {
    return props.currentMember.permissions.DELETE_PROJECT;
});

const sideTypes = ["required", "optional", "unsupported"];
const shopTypes = ["stall", "shop"];
const patchData = computed(() => {
    const data = {};

    if (name.value !== props.project.title) {
        data.title = name.value.trim();
    }
    if (slug.value !== props.project.slug) {
        data.slug = slug.value.trim();
    }
    if (summary.value !== props.project.description) {
        data.description = summary.value.trim();
    }
    if (clientSide.value !== props.project.client_side) {
        data.client_side = clientSide.value;
    }
    if (serverSide.value !== props.project.server_side) {
        data.server_side = serverSide.value;
    }
    if (tags.value.approvedStatuses.includes(props.project.status)) {
        if (visibility.value !== props.project.status) {
            data.status = visibility.value;
        }
    } else if (visibility.value !== props.project.requested_status) {
        data.requested_status = visibility.value;
    }
    if (
        coordX.value !== props.project.coordinates.x ||
        coordZ.value !== props.project.coordinates.z
    ) {
        data.coordinates = {
            x: coordX.value,
            z: coordZ.value,
        };
    }
    if (stallColor.value !== props.project.stall_color) {
        data.stall_color = stallColor.value;
    }
    const newStallValue = stall.value === "stall";

    if (newStallValue !== props.project.stall) {
        data.stall = newStallValue;
    }

    return data;
});

const hasChanges = computed(() => {
    return (
        Object.keys(patchData.value).length > 0 ||
        deletedIcon.value ||
        icon.value
    );
});

const hasModifiedVisibility = () => {
    const originalVisibility = tags.value.approvedStatuses.includes(
        props.project.status,
    )
        ? props.project.status
        : props.project.requested_status;

    return originalVisibility !== visibility.value;
};

const saveChanges = async () => {
    if (hasChanges.value) {
        await props.patchProject(patchData.value);
    }

    if (deletedIcon.value) {
        await deleteIcon();
        deletedIcon.value = false;
    } else if (icon.value) {
        await props.patchIcon(icon.value);
        icon.value = null;
    }
};

const showPreviewImage = (files) => {
    const reader = new FileReader();
    icon.value = files[0];
    deletedIcon.value = false;
    reader.readAsDataURL(icon.value);
    reader.onload = (event) => {
        previewImage.value = event.target.result;
    };
};

const deleteProject = async () => {
    await useBaseFetch(`project/${props.project.id}`, {
        method: "DELETE",
    });
    await initUserProjects();
    await router.push("/dashboard/shops");
    addNotification({
        group: "main",
        title: "Shop deleted",
        text: "Your shop has been deleted.",
        type: "success",
    });
};

const markIconForDeletion = () => {
    deletedIcon.value = true;
    icon.value = null;
    previewImage.value = null;
};

const deleteIcon = async () => {
    await useBaseFetch(`project/${props.project.id}/icon`, {
        method: "DELETE",
    });
    await props.resetProject();
    addNotification({
        group: "main",
        title: "Shop icon removed",
        text: "Your shop's icon has been removed.",
        type: "success",
    });
};
</script>
<style lang="scss" scoped>
.visibility-info {
    padding: 0;
    list-style: none;

    li {
        display: flex;
        align-items: center;
        gap: var(--spacing-card-xs);
    }
}

svg {
    &.good {
        color: var(--color-green);
    }

    &.bad {
        color: var(--color-red);
    }

    &.warn {
        color: var(--color-orange);
    }
}

.summary-input {
    min-height: 8rem;
    max-width: 24rem;
}

.small-multiselect {
    max-width: 15rem;
}

.button-group {
    justify-content: flex-start;
}
</style>
