<template>
  <div
    v-if="
      project.issues_url ||
      project.source_url ||
      project.wiki_url ||
      project.discord_url ||
      project.donation_urls.length > 0
    "
    class="flex flex-col gap-3"
  >
    <h2 class="text-lg m-0">Links</h2>
    <div
      class="flex flex-col gap-3 font-semibold [&>a]:flex [&>a]:gap-2 [&>a]:items-center [&>a]:w-fit [&>a]:text-primary [&>a]:leading-[1.2] [&>a:hover]:underline"
    >
      <a
        v-if="project.issues_url"
        :href="project.issues_url"
        :target="linkTarget"
        rel="noopener nofollow ugc"
      >
        <IssuesIcon aria-hidden="true" />
        Report issues
        <IconExternalLink aria-hidden="true" class="external-icon" />
      </a>
      <a
        v-if="project.source_url"
        :href="project.source_url"
        :target="linkTarget"
        rel="noopener nofollow ugc"
      >
        <CodeIcon aria-hidden="true" />
        View source
        <IconExternalLink aria-hidden="true" class="external-icon" />
      </a>
      <a
        v-if="project.wiki_url"
        :href="project.wiki_url"
        :target="linkTarget"
        rel="noopener nofollow ugc"
      >
        <WikiIcon aria-hidden="true" />
        Visit wiki
        <IconExternalLink aria-hidden="true" class="external-icon" />
      </a>
      <a
        v-if="project.discord_url"
        :href="project.discord_url"
        :target="linkTarget"
        rel="noopener nofollow ugc"
      >
        <DiscordIcon class="shrink" aria-hidden="true" />
        Join Discord server
        <IconExternalLink aria-hidden="true" class="external-icon" />
      </a>
      <hr
        v-if="
          (project.issues_url || project.source_url || project.wiki_url || project.discord_url) &&
          project.donation_urls.length > 0
        "
        class="w-full border-button-border my-0.5"
      />
      <a
        v-for="(donation, index) in project.donation_urls"
        :key="index"
        :href="donation.url"
        :target="linkTarget"
        rel="noopener nofollow ugc"
      >
        <BuyMeACoffeeIcon v-if="donation.id === 'bmac'" aria-hidden="true" />
        <PatreonIcon v-else-if="donation.id === 'patreon'" aria-hidden="true" />
        <KoFiIcon v-else-if="donation.id === 'ko-fi'" aria-hidden="true" />
        <PayPalIcon v-else-if="donation.id === 'paypal'" aria-hidden="true" />
        <OpenCollectiveIcon v-else-if="donation.id === 'open-collective'" aria-hidden="true" />
        <IconHeart v-else-if="donation.id === 'github'" />
        <CurrencyIcon v-else />
        <IconExternalLink aria-hidden="true" class="external-icon" />
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IconCode, IconBrandDiscord, IconExternalLink, IconHeart, IconAlertTriangle } from '@tabler/icons-vue';


defineProps<{
  project: {
    issues_url: string
    source_url: string
    wiki_url: string
    discord_url: string
    donation_urls: {
      id: string
      url: string
    }[]
  }
  linkTarget: string
}>()

</script>
