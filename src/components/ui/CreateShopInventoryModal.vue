<template>
  <MultiStageModal
    ref="modal"
    :stages="ctx.stageConfigs"
    :context="ctx"
    :breadcrumbs="!editingInventory"
    @hide="() => (modalOpen = false)"
  />
</template>

<script lang="ts" setup>
import MultiStageModal from '../modrinth/ui/base/MultiStageModal.vue';
import DropArea from './DropArea.vue';


const props = defineProps<{
  project: Record<any, any>;
}>();

function openCreateInventoryModal(
  inventory: Record<any, any> | null = null,
  stageId: string | null = null
) {
  newDraftInventory(project.value.id)
}

</script>

<style>

</style>