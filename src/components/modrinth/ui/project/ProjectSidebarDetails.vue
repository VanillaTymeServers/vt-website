<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-lg m-0">Details</h2>
    <div class="flex flex-col gap-3 font-semibold [&>div]:flex [&>div]:gap-2 [&>div]:items-center">
      <div>
        <BookTextIcon aria-hidden="true" />
        <div>
          Licensed
          <a
            v-if="project.license.url"
            class="text-link hover:underline"
            :href="project.license.url"
            :target="linkTarget"
            rel="noopener nofollow ugc"
          >
            {{ licenseIdDisplay }}
            <IconExternalLink aria-hidden="true" class="external-icon ml-1 mt-[-1px] inline" />
          </a>
          <span
            v-else-if="
              project.license.id === 'LicenseRef-All-Rights-Reserved' ||
              !project.license.id.includes('LicenseRef')
            "
          >
            {{ licenseIdDisplay }}
          </span>
          <span v-else>{{ licenseIdDisplay }}</span>
        </div>
      </div>
      <div
        v-if="project.approved"
        v-tooltip="dayjs(project.approved).format('MMMM D, YYYY [at] h:mm A')"
      >
        <CalendarIcon aria-hidden="true" />
        <div>
          Published {{publishedDate}}
        </div>
      </div>
      <div v-else v-tooltip="dayjs(project.published).format('MMMM D, YYYY [at] h:mm A')">
        <CalendarIcon aria-hidden="true" />
        <div>
          Created {{createdDate}}
        </div>
      </div>
      <div
        v-if="project.status === 'processing' && project.queued"
        v-tooltip="dayjs(project.queued).format('MMMM D, YYYY [at] h:mm A')"
      >
        <ScaleIcon aria-hidden="true" />
        <div>
          Submitted {{submittedDate}}
        </div>
      </div>
      <div
        v-if="hasVersions && project.updated"
        v-tooltip="dayjs(project.updated).format('MMMM D, YYYY [at] h:mm A')"
      >
        <VersionIcon aria-hidden="true" />
        <div>
          Updated {{ updatedDate }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IconBook2, IconCalendar, IconScale, IconGitCommit, IconExternalLink } from '@tabler/icons-vue'
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  project: {
    id: string
    published: string
    updated: string
    approved: string
    queued: string
    status: string
    license: {
      id: string
      url: string
    }
  }
  linkTarget: string
  hasVersions: boolean
}>()

const createdDate = computed(() =>
  props.project.published ? dayjs(props.project.published).fromNow() : 'unknown',
)
const submittedDate = computed(() =>
  props.project.queued ? dayjs(props.project.queued).fromNow() : 'unknown',
)
const publishedDate = computed(() =>
  props.project.approved ? dayjs(props.project.approved).fromNow() : 'unknown',
)
const updatedDate = computed(() =>
  props.project.updated ? dayjs(props.project.updated).fromNow() : 'unknown',
)

const licenseIdDisplay = computed(() => {
  const id = props.project.license.id

  if (id === 'LicenseRef-All-Rights-Reserved') {
    return 'ARR'
  } else if (id.includes('LicenseRef')) {
    return id.replaceAll('LicenseRef-', '').replaceAll('-', ' ')
  } else {
    return id
  }
})

</script>
