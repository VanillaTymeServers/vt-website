<template>
    <div class="experimental-styles-within">
        <div class="landing-hero">
            <h1 class="main-header">
                Vote for <br />
                Vanilla Tyme SMP
            </h1>
            <h2 class="main-subheader">
                Support the server by voting to help us grow and keep the
                community active!
            </h2>
            <div class="button-group">
                <button
                    class="iconified-button brand-button btn btn-large"
                    @click="scrollToVoteSites"
                >
                    <IconCheckbox />
                    Vote for the server
                </button>
                <button
                    class="iconified-button outline-button btn btn-large"
                    @click="scrollToLeaderboard"
                >
                    View the leaderboard
                </button>
            </div>
            <section ref="voteSiteSection" class="mt-6">
                <h1>Vote links</h1>
                <div class="vote-links flex flex-wrap justify-center gap-4">
                    <Button
                        external
                        class="card items-center"
                        v-for="site in voteSites"
                        :key="site.label"
                        large
                        :link="site.url"
                    >
                        <div class="flex flex-col">
                            <h3>{{ site.label }}</h3>
                            <p>{{ getHostname(site.url) }}</p>
                        </div>
                    </Button>
                </div>
            </section>
        </div>

        <section
            ref="voteTiersSection"
            class="vote-tiers relative flex w-full flex-col content-center justify-center"
        >
            <h1 class="subheader">Vote reward tiers</h1>
            <div
                class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                <template v-for="tier in tiers" :key="tier.name">
                    <div
                        class="flex flex-col gap-6 rounded-xl border-2 bg-gradient-to-br p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        :class="[tier.bgGradient, tier.border]"
                    >
                        <div class="space-y-4">
                            <div class="text-center">
                                <h3
                                    class="text-2xl font-bold"
                                    :class="tier.textColor"
                                >
                                    {{ tier.name }}
                                </h3>
                            </div>
                        </div>
                        <div class="text-center">
                            <div
                                class="bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent"
                                :class="tier.gradient"
                            >
                                {{ tier.percentage }}%
                            </div>
                            <p
                                class="text-center text-sm opacity-80"
                                :class="tier.textColor"
                            >
                                Chance
                            </p>
                        </div>
                        <div class="flex justify-center">
                            <span
                                class="rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium uppercase tracking-wider text-white shadow-sm"
                                :class="tier.gradient"
                            >
                                {{ tier.rarity }}
                            </span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="card">
                <div class="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                    <div>
                        <div class="text-2xl font-bold text-emerald-400">
                            100%
                        </div>
                        <div class="text-secondary">Total coverage</div>
                    </div>
                    <div>
                        <div
                            class="text-2xl font-bold"
                            style="color: rgb(96 165 250)"
                        >
                            4
                        </div>
                        <div class="text-secondary">Reward Tiers</div>
                    </div>
                    <div>
                        <div
                            class="text-2xl font-bold"
                            style="color: rgb(168 85 247)"
                        >
                            1%
                        </div>
                        <div class="text-secondary">Rarest Drop</div>
                    </div>
                    <div>
                        <div
                            class="text-2xl font-bold"
                            style="color: rgb(255 159 28)"
                        >
                            74%
                        </div>
                        <div class="text-secondary">Most Common</div>
                    </div>
                </div>
            </div>
        </section>
        <section
            class="collectibles relative mx-auto flex w-full flex-col gap-8"
        >
            <h1
                class="relative m-0 mt-8 max-w-3xl text-3xl leading-[120%] md:text-7xl"
            >
                Collectible Trade-ins
            </h1>
            <h2
                class="relative m-0 max-w-2xl text-base font-normal leading-[155%] text-secondary md:text-[18px]"
            >
                Trade your unique collectibles for exclusive perks and rewards
            </h2>
            <div class="space-y-8">
                <div
                    class="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-2"
                >
                    <div
                        class="relative flex flex-col gap-4 rounded-2xl bg-bg-raised p-6 text-left md:p-12"
                    >
                        <div class="flex items-center gap-2">
                            <IconStar class="h-6 w-6" />
                            <div>
                                <h3 class="m-0 text-xl font-bold">
                                    Trade 5 Collectibles
                                </h3>
                                <p class="m-0 text-xs opacity-70">
                                    unique collectibles
                                </p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="m-0 text-sm font-medium opacity-80">
                                Available trade options:
                            </h4>
                            <div class="gap-2">
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Spawn any mob (except Wither/Dragon) at
                                        chosen location
                                    </p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Unenchanted Trident
                                    </p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        3x3 Nether roof access
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative flex flex-col gap-4 rounded-2xl bg-bg-raised p-6 text-left md:p-12"
                    >
                        <div class="flex items-center gap-2">
                            <IconBolt class="h-6 w-6" />
                            <div>
                                <h3 class="m-0 text-xl font-bold">
                                    Trade 10 Collectibles
                                </h3>
                                <p class="m-0 text-xs opacity-70">
                                    unique collectibles
                                </p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="m-0 text-sm font-medium opacity-80">
                                Available trade options:
                            </h4>
                            <div class="gap-2">
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Move any spawner to your base (same
                                        dimension, with permissions)
                                    </p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        <a
                                            href="https://store.vanillatymeservers.com/package/3584585"
                                            class="title-link"
                                            target="_blank"
                                            >Supporter</a
                                        >
                                        rank
                                    </p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Convert Overworld spawner to zombie,
                                        skeleton, spider, or cave spider
                                    </p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Looting III Netherite axe
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="relative flex flex-col gap-4 rounded-2xl bg-bg-raised p-6 text-left md:p-12"
                    >
                        <div class="flex items-center gap-2">
                            <IconCrown class="h-6 w-6" />
                            <div>
                                <h3 class="m-0 text-xl font-bold">
                                    Trade 24 Collectibles
                                </h3>
                                <p class="m-0 text-xs opacity-70">
                                    unique collectibles
                                </p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="m-0 text-sm font-medium opacity-80">
                                Available trade options:
                            </h4>
                            <div class="gap-2">
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Mending + Infinity Bow
                                    </p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        1.14 God Armor Set: Diamond armor with
                                        all Protection types (IV), Thorns III,
                                        plus Depth Strider III, Feather Falling
                                        IV, Aqua Affinity & Respiration III
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="relative flex flex-col gap-4 rounded-2xl bg-bg-raised p-6 text-left md:p-12"
                    >
                        <div class="flex items-center gap-2">
                            <IconSparkles class="h-6 w-6" />
                            <div>
                                <h3 class="m-0 text-xl font-bold">
                                    Trade 3 Sets
                                </h3>
                                <p class="m-0 text-xs opacity-70">
                                    of 24 unique collectibles
                                </p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="m-0 text-sm font-medium opacity-80">
                                Available trade options:
                            </h4>
                            <div class="gap-2">
                                <div class="flex items-start gap-2">
                                    <div
                                        class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                                    />
                                    <p class="m-0 text-sm leading-relaxed">
                                        Custom personalized collectible item of
                                        your choice added to collectible list.
                                        Contact staff via Discord ticket to
                                        start approval process. Remains in
                                        rotation permanently (unless player
                                        banned)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="flex justify-center">...and more coming soon™!</p>
                <div class="card">
                    <div class="space-y-2 text-center">
                        <h3 class="m-0 text-lg font-bold">
                            How Trade-Ins work
                        </h3>
                        <p class="m-0 text-sm leading-relaxed">
                            Collect unique items through voting, then trade them
                            in for special perks! Once you have the required
                            number of unique collectibles, you can exchange them
                            for any of the available options in that tier.
                            Choose wisely - traded collectibles are consumed in
                            the process.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section
            id="leaderboard"
            class="leaderboard relative mx-auto flex w-full flex-col gap-8"
        >
            <h1
                class="relative m-0 mt-8 max-w-3xl text-3xl leading-[120%] md:text-7xl"
            >
                Voting Leaderboard
            </h1>
            <h2
                class="relative m-0 max-w-2xl text-base font-normal leading-[155%] text-secondary md:text-[18px]"
            >
                Just a little friendly competition!
            </h2>
            <div class="space-y-4">
                <div class="flex w-full gap-3">
                    <div class="iconified-input flex-grow">
                        <IconSearch class="text-lg" aria-hidden="true" />
                        <input
                            v-model="query"
                            class="h-12"
                            autocomplete="off"
                            spellcheck="false"
                            type="text"
                            :placeholder="`Search usernames...`"
                            @input="updateSearchResults()"
                        />
                        <Button
                            v-if="query"
                            class="r-btn"
                            @click="
                                () => {
                                    query = '';
                                    updateSearchResults();
                                }
                            "
                        >
                            <IconX />
                        </Button>
                    </div>
                    <div class="flex w-auto items-center gap-2">
                        <DropdownSelect
                            v-slot="{ selected }"
                            v-model="currentSortType"
                            class="md-flex-grow-0 !h-full !w-auto flex-grow"
                            name="Sort by"
                            :options="sortTypes"
                            :display-name="(option) => option?.display"
                            @change="updateSearchResults()"
                        >
                            <span class="font-semibold text-primary"
                                >Sort by:
                            </span>
                            <span class="font-semibold text-secondary">{{
                                selected
                            }}</span>
                        </DropdownSelect>
                    </div>
                </div>
                <div class="universal-card mt-3">
                    <div class="grid-table">
                        <div class="grid-table__row grid-table__header">
                            <div>Avatar</div>
                            <div>Username</div>
                            <div class="desktop-only">Daily</div>
                            <div class="desktop-only">Weekly</div>
                            <div class="desktop-only">Monthly</div>
                            <div class="desktop-only">All Time</div>
                            <div class="mobile-only">D / W / M / All</div>
                        </div>
                        <div
                            class="grid-table__row"
                            v-for="vote in results"
                            :key="vote.uuid"
                        >
                            <div>
                                <Avatar
                                    :src="`https://minotar.net/helm/${vote.uuid}`"
                                    aria-hidden="true"
                                    :alt="vote.PlayerName"
                                    noShadow
                                    loading="lazy"
                                />
                            </div>
                            <div>{{ vote.PlayerName }}</div>
                            <div class="desktop-only">
                                {{ vote.DailyTotal }}
                            </div>
                            <div class="desktop-only">
                                {{ vote.WeeklyTotal }}
                            </div>
                            <div class="desktop-only">
                                {{ vote.MonthTotal }}
                            </div>
                            <div class="desktop-only">
                                {{ vote.AllTimeTotal }}
                            </div>
                            <div class="mobile-only">
                                {{ vote.DailyTotal }} / {{ vote.WeeklyTotal }} /
                                {{ vote.MonthTotal }} / {{ vote.AllTimeTotal }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section
            class="faq relative !mt-8 flex flex-col gap-4 rounded-2xl bg-bg-raised p-6 text-left md:p-12"
        >
            <h1 class="m-0 text-lg font-bold">Frequently Asked Questions</h1>
            <div class="details-hide flex flex-col gap-1">
                <details class="group">
                    <summary
                        class="flex cursor-pointer items-center py-3 font-medium text-contrast"
                    >
                        <span
                            class="mr-2 transition-transform duration-200 group-open:rotate-90"
                        >
                            <IconArrowRight />
                        </span>
                        What are collectibles?
                    </summary>
                    <p class="m-0 ml-6 leading-[160%]">
                        Collectibles are special items that you can obtain from
                        voting and turn in to get various perks. Some
                        collectibles have special desirable characteristics that
                        cannot be obtained in vanilla Minecraft while others are
                        just for show. All Collectibles can be identified by the
                        “Collectible” text in the lore of the item. Collectibles
                        are commonly traded, bought, and sold between players.
                        <br />
                        <br />
                        All staff have a collectible named for them. Players
                        have the ability to get a collectible named for them by
                        winning early map competitions or by turning in sets of
                        collectibles.
                    </p>
                </details>
                <details class="group">
                    <summary
                        class="flex cursor-pointer items-center py-3 font-medium text-contrast"
                    >
                        <span
                            class="mr-2 transition-transform duration-200 group-open:rotate-90"
                        >
                            <IconArrowRight />
                        </span>
                        What are trophies?
                    </summary>
                    <p class="m-0 ml-6 leading-[160%]">
                        Trophies are special items awarded to players. Trophies
                        can commonly be obtained as milestone voting swords
                        (every 50 votes), holiday gifts, event gifts,
                        competition prizes, weekly competition prizes, mini-game
                        winner prizes and more.
                        <br />
                        <br />
                        All Trophies can be identified by the “Trophy” text in
                        the lore of the item. Like collectibles, trophies are
                        commonly traded, bought, and sold between players in
                        game.
                        <br />
                        <br />
                        5 Trophies can be traded in for one Collectible. Contact
                        a staff member in game or through discord support when
                        you are ready to trade the trophies in. You will be
                        given a Collectible Scoop.
                    </p>
                </details>
                <details class="group">
                    <summary
                        class="flex cursor-pointer items-center py-3 font-medium text-contrast"
                    >
                        <span
                            class="mr-2 transition-transform duration-200 group-open:rotate-90"
                        >
                            <IconArrowRight />
                        </span>
                        Add more relating to voting and collectibles
                    </summary>
                    <p class="m-0 ml-6 leading-[160%]">
                        Trophies are special items awarded to players. Trophies
                        can commonly be obtained as milestone voting swords
                        (every 50 votes), holiday gifts, event gifts,
                        competition prizes, weekly competition prizes, mini-game
                        winner prizes and more.
                        <br />
                        <br />
                        All Trophies can be identified by the “Trophy” text in
                        the lore of the item. Like collectibles, trophies are
                        commonly traded, bought, and sold between players in
                        game.
                        <br />
                        <br />
                        5 Trophies can be traded in for one Collectible. Contact
                        a staff member in game or through discord support when
                        you are ready to trade the trophies in. You will be
                        given a Collectible Scoop.
                    </p>
                </details>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import {
    IconCheckbox,
    IconSearch,
    IconX,
    IconStar,
    IconBolt,
    IconCrown,
    IconSparkles,
    IconArrowRight,
} from "@tabler/icons-vue";
import Button from "~/components/modrinth/ui/base/Button.vue";
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import DropdownSelect from "~/components/modrinth/ui/base/DropdownSelect.vue";
import Avatar from "~/components/ui/Avatar.vue";
import Card from "~/components/modrinth/ui/base/Card.vue";

interface VoteSite {
    name: string;
    url: string;
    label: string;
}
interface SortType {
    display: string;
    name: string;
}

const title = "Vote for Vanilla Tyme SMP";
const description =
    "Support the Vanilla Tyme SMP server by voting and helping us grow!";
useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
});
const voteSiteSection = ref<HTMLDivElement | null>(null);
const scrollToVoteSites = () => {
    nextTick(() => {
        if (voteSiteSection.value) {
            window.scrollTo({
                top: voteSiteSection.value.offsetTop,
                behavior: "smooth",
            });
        }
    });
};

const scrollToLeaderboard = () => {
    const element = document.getElementById("leaderboard");
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};
const voteSites = (await useBaseFetch("vote/sites")) as VoteSite[];
const query = ref("");
const sortTypes: SortType[] = [
    {
        name: "today",
        display: "Today",
    },
    {
        name: "week",
        display: "This week",
    },
    {
        name: "month",
        display: "This month",
    },
    {
        name: "all",
        display: "All time",
    },
];
const currentSortType: Ref<SortType> = ref({
    name: "all",
    display: "All time",
});

const tiers = [
    {
        name: "Regular",
        percentage: 74,
        rarity: "common" as const,
        gradient: "regular-gradient",
        bgGradient: "regular-bg-gradient",
        textColor: "regular-text-color",
        border: "regular-border",
    },
    {
        name: "Lucky",
        percentage: 20,
        rarity: "uncommon" as const,
        gradient: "lucky-gradient",
        bgGradient: "lucky-bg-gradient",
        textColor: "lucky-text-color",
        border: "lucky-border",
    },
    {
        name: "Extra Lucky",
        percentage: 5,
        rarity: "rare" as const,
        gradient: "extra-lucky-gradient",
        bgGradient: "extra-lucky-bg-gradient",
        textColor: "extra-lucky-text-color",
        border: "extra-lucky-border",
    },
    {
        name: "Collectible",
        percentage: 1,
        rarity: "legendary" as const,
        gradient: "collectible-gradient",
        bgGradient: "collectible-bg-gradient",
        textColor: "collectible-text-color",
        border: "collectible-border",
    },
];

interface VoteResult {
    uuid: string;
    PlayerName: string;
    AllTimeTotal: number;
    MonthTotal: number;
    DailyTotal: number;
    WeeklyTotal: number;
    DayVoteStreak: number;
}

const results = ref<VoteResult[]>([]);
const loading = ref(false);

async function updateSearchResults() {
    loading.value = true;
    try {
        const { data } = await useFetch<VoteResult[]>("/api/votes", {
            query: {
                username: query.value || undefined,
                order: currentSortType.value.name,
                limit: 10,
            },
        });
        results.value = data.value ?? [];
    } catch (err) {
        console.error("Failed to load votes", err);
        results.value = [];
    } finally {
        loading.value = false;
    }
}

await updateSearchResults();

function getHostname(url: string): string {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return url;
    }
}
</script>

<style scoped lang="scss">
.landing-hero {
    position: relative;
    // background: #0f1121
    //     url("https://cdn.vanillatyme.com/vote-landing/text.png") no-repeat
    //     center 4rem;
    background-size: cover;
    padding: 6rem 1rem 6rem 1rem;
    margin-top: -5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    isolation: isolate;

    .main-subheader {
        font-size: 1.625rem;
    }

    h2 {
        line-height: 125%;
        margin: 0 0 1.625rem;
        font-weight: 400;
        line-break: loose;
        color: var(--landing-color-subheading);
        max-width: 1096px;
        mask-image: none;
    }

    .button-group {
        width: fit-content;
        margin: 0 auto;
        justify-content: center;
        mask-image: none;

        .outline-button {
            color: var(--landing-color-heading);
            background: none;
            border: 1px var(--landing-color-heading) solid;
        }
    }

    img {
        width: 100%;
        max-width: 65rem;
        height: auto;
        mask-image: none;
        z-index: 1;
    }

    .bottom-transition {
        z-index: -1;
    }
}

.main-header {
    font-size: 5.25rem;
    font-weight: 600;
    line-height: 100%;
    margin: 2rem 0;
}

.subheader {
    font-size: 3.5rem;
    font-weight: 600;
    line-height: 100%;
    margin: 0 auto;
    padding: 0 4rem 4rem;
}
.vote-links {
    max-width: min(100%, 1096px);
    width: min(100%, 1096px);
    margin: 0 auto;
}
.features {
    position: relative;
    width: 100%;
    background: var(--landing-transition-gradient-end);
    align-content: center;
    justify-content: center;
    display: flex;
    flex-direction: column;

    h3 {
        font-weight: 500;
        font-size: var(--font-size-xl) !important;
    }

    p {
        font-size: var(--font-size-md) !important;
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(4, 1fr);
        max-width: min(100%, 1096px);
        width: min(100%, 1096px);
        gap: 16px;
        margin: 0 auto;
        padding: 1rem;

        .mods {
            grid-column: 1 / 2;
            grid-row: 1 / 3;

            .table {
                margin-bottom: 1rem;
                overflow: hidden;
                max-height: 32rem;
            }

            h3,
            p {
                text-align: center;
            }

            h4 {
                margin: 0;
                color: var(--color-contrast);
            }

            .search-bar {
                width: 100%;
                padding: var(--gap-sm);
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-radius: var(--radius-md);
                border: 1px solid var(--landing-border-color);
                background:
                    linear-gradient(0deg, #3b3f55 0%, #3b3f55 100%),
                    rgba(59, 63, 85, 0.15);
                margin-bottom: 0.5rem;
                white-space: nowrap;
                font-size: var(--font-size-sm);

                .mini-input {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 0.5rem;
                    padding: var(--gap-sm) var(--gap-md);
                    border-radius: var(--radius-sm);
                    background-color: #1e202f;
                    flex-grow: 1;
                    max-width: 12rem;
                }

                h4 {
                    font-weight: normal;
                    margin-left: 0.5rem;
                }
            }

            .row {
                display: grid;
                grid-template-columns: 3rem 2fr 1fr 3.75rem;
                padding: 0 var(--gap-sm);
                gap: 1rem;

                .cell {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: var(--gap-sm) 0;
                    font-size: var(--font-size-sm);

                    .name {
                        color: var(--color-contrast);
                    }

                    .description {
                        font-size: var(--font-size-xs);
                    }

                    &.last {
                        align-items: flex-end;
                    }

                    &.check {
                        align-items: center;
                        flex-direction: row;
                    }
                }
            }

            .header {
                .cell {
                    color: var(--color-base);
                }
            }
        }

        .playing {
            grid-column: 1 / 2;
            grid-row: 4 / 5;
            position: relative;
            min-height: 23rem;

            .minecraft {
                position: absolute;
                bottom: 6rem;
                right: var(--gap-xl);
                height: 13rem;
                mask-image: none;
            }

            .launcher {
                position: absolute;
                z-index: 12;
                top: var(--gap-xl);
                left: var(--gap-xl);
                height: 13rem;
                mask-image: none;
            }

            .text {
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: var(--color-contrast);
                text-align: center;
                padding: var(--gap-xl);
                mask-image: none;
                z-index: 10;
                width: 100%;
            }
        }

        .sharing {
            grid-column: 2 / 3;
            grid-row: 2 / 3;

            .table {
                height: 11rem;
                overflow: hidden;
                margin-bottom: 1rem;
            }

            h3,
            p {
                text-align: center;
            }

            .row {
                display: grid;
                grid-template-columns: 3rem 1fr 2fr;
                padding: 0 var(--gap-sm);
                gap: 1rem;

                .cell {
                    display: flex;
                    align-items: center;
                    padding: var(--gap-sm) 0;

                    .description {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }
            }

            .header {
                display: flex;
                flex-direction: row;
                gap: 0.25rem;
                padding: var(--gap-sm) var(--gap-sm);
            }

            .export-card {
                position: absolute;
                right: 1rem;
                top: 1.5rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: var(--gap-sm);
                gap: var(--gap-md);
                border-radius: var(--radius-md);
                background:
                    linear-gradient(0deg, #3b3f55 0%, #3b3f55 100%),
                    rgba(59, 63, 85, 0.15);
                border: 1px solid var(--landing-border-color);
                margin-bottom: 1rem;
                width: 20rem;
                font-size: var(--font-size-sm);

                img {
                    width: 4.5rem;
                    height: 4.5rem;
                }

                .info {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.25rem;

                    .exporting {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 0.5rem;
                        width: 100%;

                        .tag {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            gap: 0.25rem;
                            border-radius: var(--radius-sm);
                        }

                        .small-button {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            gap: 0.25rem;
                            padding: var(--gap-xs) var(--gap-md);
                            border-radius: var(--radius-lg);
                            border: 1px solid var(--landing-border-color);
                            font-size: var(--font-size-xs);
                        }
                    }

                    .name {
                        font-size: var(--font-size-md);
                        color: var(--color-contrast);
                        margin: 0;
                    }
                }
            }
        }

        .performance {
            grid-column: 1 / 2;
            grid-row: 3 / 4;

            .title {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 0.5rem;

                h3 {
                    margin: 0;
                    font-size: var(--font-size-lg);
                }
            }

            h3,
            h4,
            p {
                text-align: center;
                margin: 0;
            }

            h4,
            h3 {
                color: var(--color-contrast);
                margin-top: var(--gap-lg) !important;
            }

            h4 {
                font-size: var(--font-size-md);
                font-weight: normal;
            }

            .table {
                height: 10rem;
                overflow: hidden;
            }

            .row {
                display: grid;
                grid-template-columns: 3rem 2fr 1fr 1fr;
                padding: 0 var(--gap-sm);
                gap: 1rem;

                .cell {
                    display: flex;
                    align-items: center;
                    padding: var(--gap-sm) 0;
                    color: var(--color-gray);

                    &.important {
                        color: var(--color-contrast);
                        font-weight: 500;
                    }
                }
            }

            .header {
                font-size: var(--font-size-sm);
                .cell {
                    color: var(--color-base);
                }
            }

            .icon-logo {
                width: 3rem;
                height: 3rem;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                background-color: var(--color-button-bg);

                &.modrinth {
                    background-color: var(--color-brand) !important;
                    border: 1px solid var(--color-accent-contrast) !important;

                    .icon {
                        width: 2rem;
                        height: 2rem;
                        z-index: 0;

                        :deep(svg) {
                            width: 2rem;
                            height: 2rem;
                        }

                        :deep(path) {
                            fill: var(--color-accent-contrast) !important;
                        }
                    }
                }
            }
        }

        .importing {
            position: relative;
            grid-column: 2 / 3;
            grid-row: 1 / 2;

            .icon-logo {
                position: absolute;
                top: 4rem;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 100%;
            }

            .outer-ring {
                position: absolute;
                top: 4rem;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .ring {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;

                .base-ring {
                    position: absolute;
                    border-radius: 100%;
                    top: 4rem;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                    border: 1px solid rgba(#a8b1ddbf, 0.25);
                }

                .first-ring {
                    @extend .base-ring;
                    width: 15rem;
                    height: 15rem;
                    background: radial-gradient(
                        50% 50% at 50% 50%,
                        rgba(5, 206, 69, 0.19) 0%,
                        rgba(15, 19, 49, 0.25) 100%
                    );
                }

                .second-ring {
                    @extend .base-ring;
                    width: 25rem;
                    height: 25rem;
                    opacity: 0.75;
                    background:
                        radial-gradient(
                            50% 50% at 50% 50%,
                            rgba(5, 206, 69, 0.19) 0%,
                            rgba(15, 19, 49, 0.25) 100%
                        ),
                        radial-gradient(
                            50% 50% at 50% 50%,
                            rgba(44, 48, 79, 0.25) 0%,
                            rgba(32, 35, 50, 0.19) 100%
                        );
                }

                .third-ring {
                    @extend .base-ring;
                    width: 35rem;
                    height: 35rem;
                    opacity: 0.5;
                    background: radial-gradient(
                        50% 50% at 50% 50%,
                        rgba(44, 48, 79, 0.25) 0%,
                        rgba(32, 35, 50, 0.19) 100%
                    );
                }
            }

            .inner-ring {
                position: relative;
            }

            .launcher-badge {
                position: absolute;
                background-color: var(--landing-transition-gradient-end);
                width: 3rem;
                height: 3rem;
                padding: 0.5rem;
                border-radius: 100%;
                z-index: 10;
                user-select: none;

                &:hover {
                    cursor: default;
                }

                &.top-left {
                    top: calc(15% - 3rem);
                    left: calc(58% - 11rem);
                }

                &.top-right {
                    top: calc(15% - 3rem);
                    right: calc(58% - 11rem);
                }

                &.bottom-left {
                    bottom: calc(41% + 3rem);
                    left: calc(58% - 11rem);
                }

                &.bottom-right {
                    bottom: calc(41% + 3rem);
                    right: calc(58% - 11rem);
                }

                &.bottom-middle {
                    bottom: calc(22% + 3rem);
                    left: 50%;
                    transform: translateX(-50%);
                }

                &.center {
                    top: calc(50% - 3rem);
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                svg {
                    width: 2rem;
                    height: 2rem;
                }

                img {
                    width: 2rem;
                    height: 2rem;
                }
            }

            .text {
                position: absolute;
                text-align: center;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                width: 100%;
                padding: var(--gap-xl);
            }
        }

        .website {
            grid-column: 2 / 3;
            grid-row: 3 / 5;
            text-align: center;
            padding: 0 !important;

            position: relative;

            .projects-showcase {
                margin: calc(7rem + var(--gap-xl)) 0 var(--gap-xl);
                z-index: 3;
                text-align: left;

                .row {
                    --gap: var(--gap-md);

                    width: 100vw;
                    gap: var(--gap);
                    margin-bottom: var(--gap);
                    display: flex;
                    overflow: hidden;
                    user-select: none;

                    .row__content {
                        flex-shrink: 0;
                        display: flex;
                        min-width: 100%;
                        gap: var(--gap);
                        transform: translateX(-15%);

                        &.offset {
                            transform: translateX(-130%);
                        }
                    }

                    .project {
                        position: relative;
                        display: flex;

                        cursor: pointer;
                        padding: 1rem;
                        gap: 1rem;
                        border-radius: 1rem;
                        border: 1px solid var(--landing-border-color);
                        transition:
                            background 0.5s ease-in-out,
                            transform 0.05s ease-in-out;
                        // Removed due to lag on mobile :(
                        background: var(--landing-blob-gradient);

                        img {
                            height: 3rem;
                        }

                        .project-info {
                            box-sizing: border-box;
                        }

                        .title {
                            color: var(--landing-color-heading);
                            max-width: 13.75rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            margin: 0;
                            font-weight: 600;
                            font-size: 1.25rem;
                            line-height: 110%;
                            display: block;
                        }

                        .description {
                            width: 13.75rem;

                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;

                            font-weight: 500;
                            font-size: 0.875rem;
                            line-height: 125%;
                            margin: 0.25rem 0 0;
                        }
                    }
                }
            }

            .ellipsis {
                position: absolute;
                top: 2rem;
                left: 50%;
                height: 150%;
                z-index: -1;
                aspect-ratio: 1;
                border-radius: 100%;
                transform: translate(-50%, 2rem);
                background: var(--landing-blob-gradient);
                border: 1px solid var(--landing-border-color);
            }

            .icon-logo {
                position: absolute;
                top: 2rem;
                left: 50%;
                transform: translate(-50%, 0);
                z-index: 4;
            }

            p {
                padding: var(--gap-xl);
                padding-top: 0;
            }
        }

        .feature {
            padding: var(--gap-xl);
            z-index: 1;
            background: radial-gradient(
                50% 50% at 50% 50%,
                rgba(44, 48, 79, 0.35) 0%,
                rgba(32, 35, 50, 0.27) 100%
            );
            box-shadow:
                2px 2px 12px 0px rgba(0, 0, 0, 0.16),
                2px 2px 64px 0px rgba(57, 61, 94, 0.45) inset;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            max-width: 540px;
            width: 100%;
            overflow: hidden;

            .additional-label {
                width: fit-content;
                padding: 0.5rem 0.75rem;
                margin-bottom: 0.5rem;
                background: var(--landing-blue-label-bg);
                color: var(--landing-blue-label);
                border-radius: 6px;
                font-weight: 700;
                font-size: 1rem;
            }

            h3,
            p {
                margin: 0;
            }

            h3 {
                font-size: var(--font-size-xl);
                color: var(--landing-color-heading);
                margin-bottom: 0.375rem;
            }

            p {
                color: var(--landing-color-subheading);
            }
        }
    }

    .feature-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--gap-lg);
        max-width: 1096px;
        margin: 0 auto;
        padding: calc(var(--gap-xl) * 2) 1rem;

        @media (max-width: 1024px) {
            grid-template-columns: repeat(1, 1fr);

            .point {
                text-align: center;

                .title {
                    justify-content: center;
                }
            }
        }

        .point {
            display: flex;
            flex-direction: column;
            gap: var(--gap-md);
            padding: 1rem 0;

            svg {
                width: 1.5rem;
                height: 1.5rem;
            }

            .title {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            h3 {
                font-size: var(--font-size-lg);
                font-weight: normal;
                color: var(--landing-color-heading);
                margin: 0;
            }

            p {
                color: var(--landing-color-subheading);
                margin: 0;
            }

            a {
                text-decoration: underline;
            }
        }
    }
}

.table {
    display: grid;
    border: 1px solid rgba(#a8b1ddbf, 0.25);
    gap: 0.25rem;
    overflow: hidden;
    font-size: var(--font-size-sm);
    background: rgba(59, 63, 85, 0.15);
    box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.16);

    .btn,
    button {
        &:hover {
            cursor: default !important;
        }
    }

    .first {
        border-top: none !important;
    }

    .row {
        &:not(.header) {
            border-top: 1px solid rgba(#a8b1ddbf, 0.25);
        }
    }
}

.row,
.header,
.table,
.project,
.export-card {
    user-select: none;

    &:hover {
        cursor: default;
    }
}

.footer {
    padding: var(--gap-xl);
    background: var(--color-accent-contrast);
    color: var(--color-contrast);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    justify-content: center;
    align-items: center;

    .section-badge {
        background-color: var(--color-brand-highlight);
        color: var(--color-brand);
        border-radius: var(--radius-sm);
        width: min-content;
        padding: var(--gap-lg) var(--gap-xl);
        white-space: nowrap;
    }

    .section-subheader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--gap-sm);
        font-size: var(--font-size-lg);
        margin: 2rem 0;

        .section-subheader-title {
            font-size: var(--font-size-xl);
            margin: 0;
        }

        .section-subheader-description {
            color: var(--color-base);
            margin: 0;
        }
    }

    .download-section {
        display: grid;
        grid-template-columns: 1fr 1px 1fr 1px 1fr;
        height: 100%;
        gap: var(--gap-lg);
        max-width: 1096px;
        margin: 0 auto;

        @media (max-width: 1024px) {
            grid-template-columns: repeat(1, 1fr);
            max-width: 340px;

            .divider {
                display: none;
            }
        }

        .divider {
            height: 13rem;
            width: 1px;
            background: var(--landing-border-color);
            margin: 0;
        }

        .download-card {
            display: flex;
            flex-direction: column;
            gap: calc(var(--gap-lg) * 2);
            padding: calc(var(--gap-lg) * 2);
            height: min-content;

            .title {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-2xl);
                gap: var(--gap-sm);
                border-radius: var(--radius-md) var(--radius-md) 0 0;
                color: var(--color-contrast);
            }

            .description {
                display: flex;
                flex-direction: column;
                align-items: center;
                border-top: none;
                font-size: var(--font-size-md);
                color: var(--color-brand);
                gap: var(--gap-sm);

                a {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--gap-sm);
                    justify-content: center;

                    &:hover {
                        cursor: pointer;
                    }
                }

                &.apple {
                    align-items: flex-start;
                }
            }

            :deep(.animated-dropdown) {
                color: var(--color-brand);
                width: 16rem;
                white-space: nowrap;

                .selected {
                    border: 1px solid var(--color-brand);
                    background-color: var(--color-accent-contrast);
                }

                .options {
                    border: 1px solid var(--color-brand);
                    border-radius: 0 0 var(--radius-md) var(--radius-md);
                }

                .option {
                    background-color: var(--color-accent-contrast);
                }

                .selected-option {
                    background-color: var(--color-brand);
                }
            }
        }
    }

    .terms {
        margin: var(--gap-xl);
        font-size: var(--font-size-lg);
        color: var(--landing-color-subheading);
        text-align: center;
        line-height: 1.5;

        a {
            text-decoration: underline;
        }
    }
}

.icon-logo {
    background: var(--color-accent-contrast);
    width: 5rem;
    height: 5rem;
    padding: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--landing-border-color);
    border-radius: var(--radius-lg);

    .icon {
        margin: auto;
        height: 3.5rem;

        :deep(svg) {
            width: 3.5rem;
            height: 3.5rem;
        }

        :deep(.rotate) {
            animation: none !important;
        }
    }
}

.gradient-border {
    position: relative;
    border-radius: var(--radius-lg);

    &:before {
        content: "";
        position: absolute;
        inset: 0;
        padding: 1px;
        z-index: -1;
        border-radius: 1rem;
        background: var(--landing-border-gradient);

        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
    }
}

.bottom-transition {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30rem;
    background: linear-gradient(
        0deg,
        var(--landing-transition-gradient-end) 0%,
        var(--landing-transition-gradient-start) 100%
    );
}

@media screen and (max-width: 1024px) {
    .feature-grid {
        grid-template-columns: 1fr !important;
        grid-template-rows: repeat(8, 1fr) !important;
        gap: var(--gap-lg);
        margin: 0 auto;
        align-content: center;

        .feature {
            width: 100% !important;
            margin: 0 auto;
        }

        .mods {
            grid-row: 1 / 3 !important;
            grid-column: 1 / 2 !important;
        }

        .importing {
            grid-row: 3 / 4 !important;
            grid-column: 1 / 2 !important;
        }

        .sharing {
            grid-row: 4 / 5 !important;
            grid-column: 1 / 2 !important;
        }

        .performance {
            grid-row: 5 / 6 !important;
            grid-column: 1 / 2 !important;
        }

        .playing {
            grid-row: 6 / 7 !important;
            grid-column: 1 / 2 !important;
        }

        .website {
            grid-row: 7 / 9 !important;
            grid-column: 1 / 2 !important;
        }
    }

    .main-header {
        font-size: 4rem !important;
    }

    .subheader {
        font-size: 1.5rem !important;
    }

    .main-subheader {
        font-size: 1.25rem !important;
    }
}

@media screen and (max-width: 746px) {
    .main-header {
        font-size: 3rem !important;
    }

    .subheader {
        font-size: 1.25rem !important;
    }

    .main-subheader {
        font-size: 1.1rem !important;
    }

    .logo-banner {
        padding: 3rem 1rem 3.75rem 1rem;

        .overlay {
            bottom: 3.5rem;
        }
    }
}

.dark-icon {
    display: block;
}

.light-icon {
    display: none;
}

.light-mode {
    .footer,
    .features {
        background: #f8f7f8;
    }

    .bottom-transition {
        background: linear-gradient(rgba(#f8f7f8, 0) 0%, #f8f7f8 100%);
    }

    .dark-icon {
        display: none;
    }

    .light-icon {
        display: block;
    }

    .feature {
        background: radial-gradient(
            50% 50% at 50% 50%,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0.27) 100%
        ) !important;
        box-shadow:
            2px 2px 64px 0px rgba(255, 255, 255, 0.45) inset,
            2px 2px 12px 0px rgba(0, 0, 0, 0.16) !important;
        border: none !important;
    }

    .gradient-border {
        &:before {
            background: var(--landing-border-gradient-light);
        }
    }

    .search-bar {
        background: var(--color-raised-bg) !important;
        border: 2px solid var(--color-brand) !important;

        .mini-input {
            background: var(--color-raised-bg) !important;
            border: 2px solid var(--color-bg);
        }
    }

    .ellipsis {
        opacity: 0.75;
        background: linear-gradient(
            180deg,
            rgba(5, 206, 69, 0.15) 0%,
            rgba(5, 206, 69, 0) 100%
        ) !important;
    }

    .landing-hero {
        // background: url("https://cdn.vanillatyme.com/vote-landing/test.png")
        //     no-repeat center 4rem;
        background-size: cover;
    }

    .base-ring {
        border: 1px solid rgba(#a8b1ddbf, 0.25) !important;
    }

    .first-ring {
        background: linear-gradient(
            180deg,
            rgba(5, 206, 69, 0.15) 0%,
            rgba(5, 206, 69, 0) 100%
        ) !important;
    }

    .second-ring {
        background: linear-gradient(
            180deg,
            rgba(5, 206, 69, 0.15) 0%,
            rgba(5, 206, 69, 0) 100%
        ) !important;
    }

    .third-ring {
        background: linear-gradient(
            180deg,
            rgba(5, 206, 69, 0.15) 0%,
            rgba(5, 206, 69, 0) 100%
        ) !important;
    }

    .table {
        background: white;
    }

    .project {
        background: rgba(255, 255, 255, 0.8) !important;
    }

    .export-card {
        background: white !important;
    }
}

.main-header-strong {
    font-weight: 600;
    background-color: #00bd3c;
    background-image: linear-gradient(
        180deg,
        #a7d0ff 0%,
        var(--color-brand) 60%
    );
    background-size: 100%;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    color: transparent;
}

.logo-banner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 1rem 6.75rem 1rem;
    overflow: hidden;
    width: 100%;
    background-color: var(--color-accent-contrast);

    svg {
        z-index: 2;
        width: auto;
        height: 32rem;
    }

    .overlay {
        z-index: 3;
        position: absolute;
        bottom: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1.5rem;
        white-space: nowrap;
    }
}
/* Regular / common */
.regular-gradient {
    background-image: linear-gradient(
        to right,
        #9ca3af,
        #4b5563
    ); /* gray-400 → gray-600 */
}
.regular-bg-gradient {
    background-image: linear-gradient(
        to right,
        #f9fafb,
        #f3f4f6
    ); /* gray-50 → gray-100 */
}
.regular-text-color {
    color: #374151; /* gray-700 */
}
.regular-border {
    border: 1px solid #d1d5db; /* gray-300 */
}

/* Lucky / uncommon */
.lucky-gradient {
    background-image: linear-gradient(
        to right,
        #4ade80,
        #16a34a
    ); /* green-400 → green-600 */
}
.lucky-bg-gradient {
    background-image: linear-gradient(
        to right,
        #f0fdf4,
        #dcfce7
    ); /* green-50 → green-100 */
}
.lucky-text-color {
    color: #15803d; /* green-700 */
}
.lucky-border {
    border: 1px solid #86efac; /* green-300 */
}

/* Extra Lucky / rare */
.extra-lucky-gradient {
    background-image: linear-gradient(
        to right,
        #60a5fa,
        #2563eb
    ); /* blue-400 → blue-600 */
}
.extra-lucky-bg-gradient {
    background-image: linear-gradient(
        to right,
        #eff6ff,
        #dbeafe
    ); /* blue-50 → blue-100 */
}
.extra-lucky-text-color {
    color: #1d4ed8; /* blue-700 */
}
.extra-lucky-border {
    border: 1px solid #93c5fd; /* blue-300 */
}

/* Collectible / legendary */
.collectible-gradient {
    background-image: linear-gradient(
        to right,
        #a78bfa,
        #ec4899,
        #f97316
    ); /* purple-400 → pink-500 → orange-500 */
}
.collectible-bg-gradient {
    background-image: linear-gradient(
        to right,
        #faf5ff,
        #fce7f3
    ); /* purple-50 → pink-100 */
}
.collectible-text-color {
    color: #6b21a8; /* purple-700 */
}
.collectible-border {
    border: 1px solid #c4b5fd; /* purple-300 */
}
.vote-tiers,
.collectibles,
.leaderboard,
.faq {
    max-width: min(100%, 1096px);
    width: min(100%, 1096px);
    margin: 0 auto;
}
.grid-table {
    display: grid;
    grid-template-columns:
        min-content
        minmax(min-content, 2fr)
        repeat(4, minmax(min-content, 1fr));

    border-radius: var(--size-rounded-sm);
    overflow: hidden;
    margin-top: var(--spacing-card-md);
    outline: 1px solid transparent;

    // ✅ Wrap this in a separate rule block
    @media (max-width: 768px) {
        grid-template-columns:
            min-content
            minmax(min-content, 2fr)
            minmax(min-content, 1fr); // Combined D/W/M/All column
    }

    .grid-table__row {
        display: contents;

        > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: var(--spacing-card-sm);

            &:first-child {
                padding-left: var(--spacing-card-bg);
            }

            &:last-child {
                padding-right: var(--spacing-card-bg);
            }
        }

        &:nth-child(2n + 1) > div {
            background-color: var(--color-table-alternate-row);
        }

        &.grid-table__header > div {
            background-color: var(--color-bg);
            font-weight: bold;
            white-space: nowrap;
            color: var(--color-text-dark);
            padding-top: var(--spacing-card-bg);
            padding-bottom: var(--spacing-card-bg);
        }
    }

    .mobile-only {
        display: flex !important;
        @media (min-width: 768px) {
            display: none !important;
        }
    }

    .desktop-only {
        display: none !important;
        @media (min-width: 768px) {
            display: flex !important;
        }
    }
}
</style>
