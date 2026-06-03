<template>
  <section class="experimental-styles-within overflow-visible">
    <ProjectPageInventory
      :project="project"
      :inventory="inventory"
      :current-member="!!currentMember"
      :base-id="baseDropdownId"
      :inventory-link="(inventory) => `/${project.project_type}/${project.slug ? project.slug : project.id}/inventory/${inventory.id}`"
    ></ProjectPageInventory>
  </section>
</template>

<script lang="ts" setup>
import ProjectPageInventory from '~/components/ui/base/project/ProjectPageInventory.vue'
const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    }
  },
  inventory: {
    type: Array,
    default() {
      return []
    }
  },
  currentMember: {
    type: Object,
    default() {
      return null
    }
  }
})
const tags = useTags()
const flags = useFeatureFlags()
const auth = await useAuth()

const baseDropdownId = useId()


</script>

<style>

</style>