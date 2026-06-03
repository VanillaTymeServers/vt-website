<template>
    <div>
        <ProjectSettingsPageInventory
            v-if="inventory?.length"
            :project="project"
            :inventory="inventory"
            :current-member="currentMember"
            :base-id="baseDropdownId"
            :open-modal="
                currentMember ? () => handleOpenCreateItemModal() : undefined
            "
        >
            <template #actions="{ inventory: item }">
                <ButtonStyled circular type="transparent">
                    <OverflowMenu
                        v-tooltip="'Edit item'"
                        class="hover:!bg-button-bg [&>svg]:!text-green"
                        :dropdown-id="`${baseDropdownId}-edit-${item.id}`"
                        :options="[
                            {
                                id: 'edit-item',
                                action: () => {
                                    navigateTo(
                                        `/${project.project_type}/${project.slug ? project.slug : project.id}/settings/inventory/${item.id}`,
                                    );
                                },
                                disabled:
                                    !currentMember ||
                                    !currentMember.permissions.EDIT_ITEMS,
                            },
                        ]"
                        aria-label="Edit item"
                    >
                        <IconEdit aria-hidden="true" />
                        <template #edit-item>
                            <IconInfoCircle aria-hidden="true" />
                            Edit item
                        </template>
                    </OverflowMenu>
                </ButtonStyled>
                <ButtonStyled circular type="transparent">
                    <OverflowMenu
                        v-tooltip="'More options'"
                        class="hover:!bg-button-bg"
                        :dropdown-id="`${baseDropdownId}-${item.id}`"
                        :options="[
                            {
                                id: 'new-tab',
                                action: () => {},
                                link: `/${project.project_type}/${
                                    project.slug ? project.slug : project.id
                                }/inventory/${encodeURI(item.displayUrlEnding)}`,
                                external: true,
                            },
                            {
                                id: 'copy-link',
                                action: () =>
                                    copyToClipboard(
                                        `https://vanillatyme.com/${project.project_type}/${
                                            project.slug
                                                ? project.slug
                                                : project.id
                                        }/inventory/${encodeURI(item.displayUrlEnding)}`,
                                    ),
                            },
                            {
                                id: 'share',
                                action: () => {},
                                shown: false,
                            },
                            {
                                id: 'report',
                                color: 'red',
                                hoverFilled: true,
                                action: () =>
                                    auth.user
                                        ? reportVersion(item.id)
                                        : navigateTo('/auth/sign-in'),
                                shown: !currentMember,
                            },
                            {
                                divider: true,
                                shown: !!currentMember || flags.developerMode,
                            },
                            {
                                id: 'copy-id',
                                action: () => {
                                    copyToClipboard(item.id);
                                },
                                shown: !!currentMember || flags.developerMode,
                            },
                            { divider: true, shown: !!currentMember },
                            {
                                id: 'edit-item',
                                action: () => {
                                    navigateTo(
                                        `/${project.project_type}/${project.slug ? project.slug : project.id}/settings/inventory/${item.id}`,
                                    );
                                },
                                shown:
                                    !!currentMember &&
                                    currentMember.permissions.EDIT_ITEMS,
                            },
                            {
                                id: 'delete',
                                color: 'red',
                                hoverFilled: true,
                                action: () => {
                                    selectedItem = item.id;
                                    deleteItemModal?.show();
                                },
                                shown:
                                    !!currentMember &&
                                    currentMember.permissions.DELETE_ITEMS,
                            },
                        ]"
                        aria-label="More options"
                    >
                        <IconDotsVertical aria-hidden="true" />
                        <template #new-tab>
                            <IconExternalLink aria-hidden="true" />
                            Open in new tab
                        </template>
                        <template #copy-link>
                            <IconLink aria-hidden="true" />
                            Copy link
                        </template>
                        <template #share>
                            <IconShare aria-hidden="true" />
                            Share
                        </template>
                        <template #report>
                            <IconFlag aria-hidden="true" />
                            Report
                        </template>
                        <template #edit-item>
                            <IconInfoCircle aria-hidden="true" />
                            Edit item
                        </template>
                        <template #delete>
                            <IconTrash aria-hidden="true" />
                            Delete
                        </template>
                        <template #copy-id>
                            <IconCopy aria-hidden="true" />
                            Copy ID
                        </template>
                    </OverflowMenu>
                </ButtonStyled>
            </template>
        </ProjectSettingsPageInventory>
        <template v-if="!inventory?.length">
            <div class="grid place-content-center py-10">
                <div class="flex flex-col items-center gap-2 text-center">
                    <div class="text-2xl font-semibold text-contrast">
                        No inventory items created
                    </div>
                    <div>
                        Create your first
                        {{
                            formatProjectType(
                                project.project_type,
                            ).toLowerCase()
                        }}
                        item.
                    </div>
                    <br />
                    <ButtonStyled color="blue">
                        <button
                            :disabled="
                                !currentMember ||
                                !currentMember.permissions.CREATE_ITEMS
                            "
                        >
                            <IconPlus /> Create item
                        </button>
                    </ButtonStyled>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import {
    IconCopy,
    IconDotsVertical,
    IconEdit,
    IconExternalLink,
    IconFlag,
    IconInfoCircle,
    IconLink,
    IconPlus,
    IconShare,
    IconTrash,
} from "@tabler/icons-vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import OverflowMenu from "~/components/modrinth/ui/base/OverflowMenu.vue";
import ModalConfirm from "~/components/ui/ModalConfirm.vue";
import ProjectSettingsPageInventory from "~/components/ui/base/project/ProjectSettingsPageInventory.vue";

import { categories } from "~/generated/state.json";

const props = defineProps({
    project: {
        type: Object,
        default() {
            return {};
        },
    },
    currentMember: {
        type: Object,
        default() {
            return null;
        },
    },
    inventory: {
        type: Array,
        default() {
            return [];
        },
    },
});
const flags = useFeatureFlags();
const auth = await useAuth();

const createProjectItemModal = useTemplateRef("create-project-item-modal");
const deleteItemModal = ref<InstanceType<typeof ModalConfirm>>();
const selectedItem = ref<string | null>(null);

const handleOpenCreateItemModal = () => {
    if (!props.currentMember) return;
    createProjectItemModal.value?.openCreateItemModal();
};

const handleCreateItem = () => {};

const handleOpenEditItemModal = (
    itemId: string,
    projectId: string,
    stageId?: string | null,
) => {
    if (!props.currentMember) return;
    createProjectItemModal.value?.openEditVersionModal(
        itemId,
        projectId,
        stageId,
    );
};

// const itemsWithDisplayUrl = computed(() =>
//     (props.inventory ?? []).map((v) => ({
//         ...v,
//         displayUrlEnding: v.id,
//     })),
// );

const baseDropdownId = useId();

async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
}

async function deleteItem() {
    const id = selectedItem.value;
    if (!id) return;

    startLoading();
}
</script>

<style></style>
