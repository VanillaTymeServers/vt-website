<template>
  <!-- Renders inside whatever default.vue provides -->
  <div
    class="experimental-styles-within relative mx-auto mb-6 flex min-h-screen w-full max-w-[1280px] flex-col px-6"
  >
    <h1>Moderation</h1>
    <NavTabs :links="moderationLinks" class="mb-4 hidden sm:flex" />
    <div class="mb-4 sm:hidden">
      <Chips
        v-model="selectedChip"
        :items="mobileNavOptions"
        :never-empty="true"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import Chips from '~/components/ui/Chips.vue'
import NavTabs from '@/components/ui/NavTabs.vue'

const route = useRoute()
const router = useRouter()

const moderationLinks = [
  { label: 'Shops', href: '/moderation' },
  { label: 'Review', href: '/moderation/technical-review' },
  { label: 'Reports', href: '/moderation/reports' },
  { label: 'News', href: '/moderation/news' },
]

const mobileNavOptions = ['Shops', 'Technical Review', 'Reports', 'News']

const selectedChip = computed({
  get() {
    const path = route.path
    if (path === '/moderation' || path === '/moderation/shops') return 'Shops'
    if (path.startsWith('/moderation/technical-review')) return 'Technical Review'
    if (path.startsWith('/moderation/reports')) return 'Reports'
    if (path === '/moderation/news' || path.startsWith('/moderation/news/')) return 'News'
    return 'Shops'
  },
  set(value: string) {
    navigateToPage(value)
  },
})

function navigateToPage(selectedOption: string) {
  if (selectedOption === 'Technical Review') router.push('/moderation/technical-review')
  else if (selectedOption === 'Reports') router.push('/moderation/reports')
  else if (selectedOption === 'News') router.push('/moderation/news')
  else router.push('/moderation')
}
</script>