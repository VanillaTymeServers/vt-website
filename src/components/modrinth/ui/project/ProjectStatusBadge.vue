<template>
  <Badge :icon="metadata.icon" :formatted-name="metadata.formattedName" />
</template>

<script setup lang="ts">
import { IconFileText, IconArchive, IconRefresh, IconLock, IconCalendar, IconWorld, IconLink, IconHelp, IconX } from '@tabler/icons-vue'

import type { Component } from 'vue'
import { computed } from 'vue'
import Badge from '~/components/modrinth/ui/base/SimpleBadge.vue'
import type { ProjectStatus } from '~/utils/types'

const props = defineProps<{
  status: ProjectStatus
}>()

const metadata = computed(() => ({
  icon: statusMetadata[props.status]?.icon ?? statusMetadata.unknown.icon,
  formattedName: statusMetadata[props.status]?.message ?? props.status,
}))

const statusMetadata: Record<ProjectStatus, { icon?: Component; message: string }> = {
  approved: {
    icon: IconWorld,
    message: "Public",
  },
  unlisted: {
    icon: IconLink,
    message: "Unlisted",
  },
  withheld: {
    icon: IconLink,
    message: "Unlisted by staff",
  },
  private: {
    icon: IconLock,
    message: "IconLock",
  },
  scheduled: {
    icon: IconCalendar,
    message: "Scheduled",
  },
  draft: {
    icon: IconFileText,
    message: "Draft",
  },
  archived: {
    icon: IconArchive,
    message: "Archived",
  },
  rejected: {
    icon: IconX,
    message: "Rejected",
  },
  processing: {
    icon: IconRefresh,
    message: "Under review",
  },
  unknown: {
    icon: IconHelp,
    message: "Unknown",
  },
}
</script>
