<template>
    <div class="experimental-styles-within">
        <div class="new-page sidebar">
            <div class="normal-page__content">
                <div class="mb-4 flex items-center justify-between">
                    <NavTabs :links="categoryTabs" :subpages="['/store/package/3584585']"/>
                    <ButtonStyled color="blue">
                        <button>
                            <IconShoppingCart />
                            Cart
                        </button>
                    </ButtonStyled>
                </div>
                <NuxtPage :route="route" />
            </div>
            <div class="normal-page__sidebar">
                <StoreSidebarPayments />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    IconHome,
    IconLabel,
    IconQuestionMark,
    IconShoppingBag,
    IconShoppingCart,
} from "@tabler/icons-vue";
import NavTabs from "~/components/ui/NavTabs.vue";
import StoreSidebarPayments from "~/components/ui/base/store/StoreSidebarRecentPayments.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";

definePageMeta({
    layout: "store",
});
const route = useNativeRoute();
// Define the type for auth to include user with a username property
interface AuthUser {
  user: {
    uuid: string;
    username?: string;
  } | null;
}
const auth = (await useAuth()).value as AuthUser;
const tebexAuth = useAuthStore()

async function resolveUsername(uuid: string): Promise<string | null> {
  try {
    const response = await $fetch<{ name: string }>(
      `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
    )
    return response.name || null
  } catch (e) {
    console.error('Failed to resolve username from UUID', e)
    return null
  }
}
let identifier = auth.user?.username // default fallback

if (auth.user?.uuid) {
  const resolvedUsername = await resolveUsername(auth.user.uuid)
  if (resolvedUsername) {
    identifier = resolvedUsername
  }
}

if (!tebexAuth.isAuthenticated && identifier) {
  await tebexAuth.login(identifier)
}

const categoryStore = useCategoryStore();
const { data: categories } = await useAsyncData("categories", () => {
    return categoryStore.fetchCategories();
});

const categoryIcons: Record<string, any> = {
    Ranks: IconLabel,
};

const categoryTabs = computed(() => {
  const baseTabs = (categories.value || []).map((category) => {
    const icon = categoryIcons[category.name] || IconQuestionMark

    // Build subpages from packages
    const subpages = (category.packages || []).map((pkg) => `/store/package/${pkg.id}`)

    return {
      label: category.name,
      href: `/store/category/${category.name.toLowerCase()}`,
      icon,
      shown: true,
      subpages, // ← new!
    }
  })

  return [
    {
      label: "Home",
      href: "/store",
      icon: IconHome,
      shown: true,
      subpages: [],
    },
    ...baseTabs,
  ]
})
</script>

<style></style>
