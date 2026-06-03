<template>
  <span :class="'version-badge ' + color + ' type--' + type">
    <template v-if="color"> <span class="circle" /> {{ capitalizeString(type) }}</template>

    <!-- User roles -->
    <template v-else-if="type === 'admin'">
      <ModrinthIcon aria-hidden="true" /> Modrinth Team
    </template>
    <template v-else-if="type === 'moderator'">
      <IconScale aria-hidden="true" /> Moderator
    </template>
    <template v-else-if="type === 'creator'">
      <IconBox aria-hidden="true" /> Creator
    </template>

    <!-- Project statuses -->
    <template v-else-if="type === 'approved'">
      <IconList aria-hidden="true" /> Listed
    </template>
    <template v-else-if="type === 'approved-general'">
      <IconCheck aria-hidden="true" /> Approved
    </template>
    <template v-else-if="type === 'unlisted'">
      <IconEyeOff aria-hidden="true" /> Unlisted
    </template>
    <template v-else-if="type === 'withheld'">
      <IconEyeOff aria-hidden="true" /> Withheld
    </template>
    <template v-else-if="type === 'private'">
      <IconLock aria-hidden="true" /> Private
    </template>
    <template v-else-if="type === 'scheduled'">
      <IconCalendar aria-hidden="true" /> Scheduled
    </template>
    <template v-else-if="type === 'draft'">
      <IconFileText aria-hidden="true" /> Draft
    </template>
    <template v-else-if="type === 'archived'">
      <IconArchive aria-hidden="true" /> Archived
    </template>
    <template v-else-if="type === 'rejected'">
      <IconX aria-hidden="true" /> Rejected
    </template>
    <template v-else-if="type === 'processing'">
      <IconRefresh aria-hidden="true" /> Under review
    </template>

    <!-- Team members -->
    <template v-else-if="type === 'accepted'">
      <IconCheck aria-hidden="true" /> Accepted
    </template>
    <template v-else-if="type === 'pending'">
      <IconRefresh aria-hidden="true" /> Pending
    </template>

    <!-- Transaction statuses (pending, processing reused) -->
    <template v-else-if="type === 'processed'">
      <IconCheck aria-hidden="true" /> Processed
    </template>
    <template v-else-if="type === 'failed'">
      <IconX aria-hidden="true" /> Failed
    </template>
    <template v-else-if="type === 'returned'">
      <IconX aria-hidden="true" /> Returned
    </template>

    <!-- Report status -->
    <template v-else-if="type === 'closed'">
      <IconX aria-hidden="true" /> Closed
    </template>

    <!-- Inventory tags -->
    <template v-else-if="type === 'sale'">
      <IconRosetteDiscount aria-hidden="true" /> Sale
    </template>

    <!-- Other -->
    <template v-else> <span class="circle" /> {{ capitalizeString(type) }} </template>
  </span>
</template>

<script setup lang="ts">
import { IconScale, IconBox, IconList, IconEyeOff, IconFileText, IconX, IconArchive, IconRefresh, IconCheck, IconLock, IconCalendar, IconRosetteDiscount } from '@tabler/icons-vue'
import { capitalizeString } from '~/plugins/shorthands'


defineProps<{
  type: string
  color?: string
}>()
</script>
<style lang="scss" scoped>
.version-badge {
  display: flex;
  align-items: center;
  font-weight: bold;
  width: fit-content;
  --badge-color: var(--color-gray);
  color: var(--badge-color);

  .circle {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
    background-color: var(--badge-color);
  }

  svg {
    margin-right: 0.25rem;
  }

  &.type--closed,
  &.type--withheld,
  &.type--rejected,
  &.type--returned,
  &.type--failed,
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
  &.type--processed,
  &.type--approved-general,
  &.green {
    --badge-color: var(--color-green);
  }

  &.type--creator,
  &.type--approved,
  &.blue {
    --badge-color: var(--color-blue);
  }

  &.type--unlisted,
  &.purple {
    --badge-color: var(--color-purple);
  }

  &.type--private,
  &.gray {
    --badge-color: var(--color-gray);
  }

  &::first-letter {
    text-transform: capitalize;
  }
}
</style>
