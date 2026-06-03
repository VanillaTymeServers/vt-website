<template>
    <div>
        <div class="normal-page no-sidebar">
            <h1>Settings</h1>
        </div>
        <div class="normal-page">
            <div class="normal-page__sidebar">
                <NavStack
                    :items="
                        [
                            {
                                type: 'heading',
                                label: 'Display',
                            },
                            {
                                link: '/settings',
                                label: 'Appearance',
                                icon: IconBrush,
                            },
                            flags.developerMode
                                ? {
                                      link: '/settings/flags',
                                      label: 'Feature Flags',
                                      icon: ToggleRightIcon,
                                  }
                                : null,
                            auth.user
                                ? {
                                      type: 'heading',
                                      label: 'Account',
                                  }
                                : null,
                            auth.user
                                ? {
                                      link: '/settings/profile',
                                      label: 'Profile',
                                      icon: UserIcon,
                                  }
                                : null,
                            auth.user
                                ? {
                                      link: '/settings/account',
                                      label: 'Account',
                                      icon: ShieldIcon,
                                  }
                                : null,
                            auth.user
                                ? {
                                      link: '/settings/sessions',
                                      label: 'Sessions',
                                      icon: MonitorSmartphoneIcon,
                                  }
                                : null,
                            auth.user
                                ? {
                                      type: 'heading',
                                      label: 'Developer',
                                  }
                                : null,
                            auth.user
                                ? {
                                      link: '/settings/pats',
                                      label: 'Personal Access Tokens',
                                      icon: KeyIcon,
                                  }
                                : null,
                            auth.user
                                ? {
                                      link: '/settings/applications',
                                      label: 'Applications',
                                      icon: ServerIcon,
                                  }
                                : null,
                        ].filter(Boolean)
                    "
                />
            </div>
            <div class="normal-page__content mt-3 lg:mt-0">
                <NuxtPage :route="route" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { IconBrush } from "@tabler/icons-vue";
import NavStack from "~/components/ui/NavStack.vue";
import NavStackItem from "~/components/ui/NavStackItem.vue";

const route = useNativeRoute();
const auth = await useAuth();
const flags = useFeatureFlags()
const isStaging = useRuntimeConfig().public.siteUrl !== "https://modrinth.com";
</script>
