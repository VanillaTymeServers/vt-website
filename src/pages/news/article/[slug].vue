<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";

import dayjs from "dayjs";
import { computed } from "vue";
import { renderHighlightedString } from "~/utils/highlight.ts";

type User = {
  id: string;
  username: string;
  avatar_url?: string | null;
  uuid: string;
};

type ArticleRaw = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  thumbnail?: string | null;
  authors: string[];
  published: string | Date;
  updated?: string | Date;
};

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  thumbnail: string;
  authors: User[];
  published: string | Date;
  updated?: string | Date;
};

const route = useRoute();

const article = await useBaseFetch(`news/article/${route.params.slug}`) as Article;

const authorCount = computed(() => article.authors.length ?? 0);
const articleUrl = computed(
  () => `https://vanillatyme.com/news/article/${route.params.slug}`
);

const dayjsDate = computed(() => dayjs(article.published));

useSeoMeta({
  title: () => `${article.title} - Vanilla Tyme News`,
  ogTitle: () => article.title,
  description: () => article.summary ?? "",
  ogDescription: () => article.summary ?? "",
  ogType: "article",
  ogImage: () => article.thumbnail,
  articlePublishedTime: () => dayjsDate.value.toISOString(),
  twitterCard: "summary_large_image",
  twitterImage: () => article.thumbnail,
});
</script>

<template>
  <div class="page experimental-styles-within py-6">
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-0 border-b-[1px] border-solid border-divider px-6 pb-6"
    >
      <nuxt-link :to="`/news`">
        <h1 class="m-0 text-3xl font-extrabold hover:underline">News</h1>
      </nuxt-link>
    </div>

    <article v-if="article" class="mt-6 flex flex-col gap-4 px-6">
      <h2 class="m-0 text-2xl font-extrabold leading-tight sm:text-4xl">{{ article.title }}</h2>
      <p class="m-0 text-base leading-tight sm:text-lg">{{ article.summary }}</p>

      <div class="mt-auto flex flex-wrap items-center gap-1 text-sm text-secondary sm:text-base">
        <template v-for="(author, index) in article.authors" :key="`author-${author.id}`">
          <span v-if="authorCount - 1 === index && authorCount > 1">and</span>
          <span class="flex items-center">
            <nuxt-link
              :to="`/user/${author.id}`"
              class="inline-flex items-center gap-1 font-semibold hover:underline hover:brightness-[--hover-brightness]"
            >
              <Avatar :src="author.avatar_url || undefined" circle size="24px" />
              {{ author.username }}
            </nuxt-link>
            <span v-if="authorCount > 2 && index !== authorCount - 1">,</span>
          </span>
        </template>

        <template v-if="authorCount === 0">
          <nuxt-link
            to="/organization/modrinth"
            class="inline-flex items-center gap-1 font-semibold hover:underline hover:brightness-[--hover-brightness]"
          >
            <Avatar src="https://cdn-raw.modrinth.com/modrinth-icon-96.webp" size="24px" />
            Vanilla Tyme Staff
          </nuxt-link>
        </template>

        <span class="hidden md:block">•</span>
        <span class="hidden md:block">{{ dayjsDate.format("MMMM D, YYYY") }}</span>
      </div>

      <span class="text-sm text-secondary sm:text-base md:hidden">
        Posted on {{ dayjsDate.format("MMMM D, YYYY") }}
      </span>

      <img
        :src="article.thumbnail"
        class="aspect-video w-full rounded-xl border-[1px] border-solid border-button-border object-cover sm:rounded-2xl"
        :alt="article.title"
      />

      <div class="markdown-body" v-html="renderHighlightedString(article.body)" />

      <h3
        class="mb-0 mt-4 border-0 border-t-[1px] border-solid border-divider pt-4 text-base font-extrabold sm:text-lg"
      >
        Share this article
      </h3>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.page {
  > *:not(.full-width-bg),
  > .full-width-bg > * {
    max-width: 56rem;
    margin-inline: auto;
  }
}

.brand-gradient-bg {
  background: var(--brand-gradient-bg);
  border-color: var(--brand-gradient-border);
}

@media (max-width: 640px) {
  .page {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  article {
    gap: 1rem;
  }
}

:deep(.markdown-body) {
  h1,
  h2 {
    border-bottom: none;
    padding: 0;
  }

  ul > li:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  ul,
  ol {
    p {
      margin-bottom: 0.5rem;
    }
  }

  ul,
  ol {
    strong {
      color: var(--color-contrast);
      font-weight: 600;
    }
  }

  h1,
  h2,
  h3 {
    margin-bottom: 0.25rem;
  }

  h1 {
    font-size: 1.5rem;
    @media (min-width: 640px) {
      font-size: 2rem;
    }
  }

  h2 {
    font-size: 1.25rem;
    @media (min-width: 640px) {
      font-size: 1.5rem;
    }
  }

  h3 {
    font-size: 1.125rem;
    @media (min-width: 640px) {
      font-size: 1.25rem;
    }
  }

  p {
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
    @media (min-width: 640px) {
      font-size: 1rem;
    }
  }

  a {
    color: var(--color-brand);
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  h1,
  h2 {
    a {
      font-weight: 800;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    a {
      color: var(--color-contrast);
    }
  }

  img {
    border: 1px solid var(--color-button-border);
    border-radius: var(--radius-md);
    @media (min-width: 640px) {
      border-radius: var(--radius-lg);
    }
  }

  > img,
  > :has(img:first-child:last-child) {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 640px) {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-bottom: 0.5rem;
    }

    p {
      margin-bottom: 1rem;
    }

    ul,
    ol {
      padding-left: 1.25rem;
    }

    pre {
      overflow-x: auto;
      font-size: 0.75rem;
    }

    table {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
  }
}
</style>
