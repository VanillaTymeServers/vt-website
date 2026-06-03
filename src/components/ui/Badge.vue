<template>
  <span
    :class="
      'badge flex items-center gap-1 font-semibold text-secondary ' + color + ' type--' + type
    "
  >
    <template v-if="color"> <span class="circle" /> {{ capitalizeString(type) }}</template>

    <!-- User roles -->
    <template v-else-if="type === 'admin'"> <IconIceCream /> Modrinth Team</template>
    <template v-else-if="type === 'moderator'"> <IconScale/> Moderator</template>
    <template v-else-if="type === 'creator'"><IconBox /> Creator</template>
    <template v-else-if="type === 'plus'"><IconPlus /> Modrinth Plus</template>

    <!-- Project statuses -->
    <template v-else-if="type === 'approved'"><IconWorld /> Public</template>
    <template v-else-if="type === 'approved-general'"><IconCheck /> Approved</template>
    <template v-else-if="type === 'unlisted' || type === 'withheld'"
      ><IconLink /> Unlisted</template
    >
    <template v-else-if="type === 'private'"><IconLock /> Private</template>
    <template v-else-if="type === 'scheduled'"> <IconCalendar /> Scheduled</template>
    <template v-else-if="type === 'draft'"><IconFileText /> Draft</template>
    <template v-else-if="type === 'archived'"> <IconArchive /> Archived</template>
    <template v-else-if="type === 'rejected'"><IconX /> Rejected</template>
    <template v-else-if="type === 'processing'"> <IconRefresh /> Under review</template>

    <!-- Team members -->
    <template v-else-if="type === 'accepted'"><IconCheck /> Accepted</template>
    <template v-else-if="type === 'pending'"> <IconRefresh /> Pending </template>

    <!-- Transaction statuses -->
    <template v-else-if="type === 'success'"><IconCheck /> Success</template>

    <!-- Report status -->
    <template v-else-if="type === 'closed'"> <IconCircleX /> Closed</template>

    <!-- Other -->
    <template v-else> <span class="circle" /> {{ capitalizeString(type) }} </template>
  </span>
</template>

<script setup>
import { IconGlobe, IconLink, IconIceCream, IconPlus, IconScale, IconBox, IconFileText, IconX, IconArchive, IconRefresh, IconCheck, IconLock, IconCalendar, IconCircleX, IconWorld } from "@tabler/icons-vue";
import { capitalizeString } from "~/utils/utils";

defineProps({
  type: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.badge {
  .circle {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
    background-color: var(--badge-color);
  }

  svg {
    vertical-align: -15%;
    width: 1em;
    height: 1em;
  }

  &.type--closed,
  &.type--withheld,
  &.type--rejected,
  &.red {
    --badge-color: var(--color-red);
  }

  &.type--pending,
  &.type--moderator,
  &.type--processing,
  &.type--scheduled,
  &.orange {
    --badge-color: var(--color-orange);
  }

  &.type--accepted,
  &.type--admin,
  &.type--success,
  &.type--approved-general,
  &.green {
    --badge-color: var(--color-green);
  }

  &.type--creator,
  &.blue {
    --badge-color: var(--color-blue);
  }

  &.type--unlisted,
  &.type--plus,
  &.purple {
    --badge-color: var(--color-purple);
  }

  &.type--private,
  &.type--approved,
  &.gray {
    --badge-color: var(--color-secondary);
  }
}
</style>
