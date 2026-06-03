<template>
    <div>
        <div class="landing-hero">
            <img
                src="/VT_logo_cone.webp"
                alt=""
                class="modrinth-icon text-brand"
            />
            <h1 class="main-header">
                A Minecraft server for
                <div class="animate-strong">
                    <span>
                        <strong class="main-header-strong"
                            >builders <br
                        /></strong>
                        <strong class="main-header-strong"
                            >explorers <br
                        /></strong>
                        <strong class="main-header-strong"
                            >redstoners <br
                        /></strong>
                        <strong class="main-header-strong"
                            >friends <br
                        /></strong>
                        <strong class="main-header-strong"
                            >dreamers <br
                        /></strong>
                        <strong class="main-header-strong">you</strong>
                    </span>
                </div>
            </h1>
            <h2>
                Build, explore, and hang out in a vanilla-like world shaped by
                players — not paywalls.
            </h2>
            <div class="button-group">
                <ButtonStyled color="brand" size="large">
                    <nuxt-link to="/shops">
                        <IconCompass aria-hidden="true" />
                        Explore shops
                    </nuxt-link>
                </ButtonStyled>
                <ButtonStyled size="large" type="outlined">
                    <nuxt-link
                        v-if="!auth.user"
                        to="https://discord.vanillatymeservers.com"
                        rel="noopener nofollow"
                    >
                        <IconClipboardList aria-hidden="true" />
                        Apply to join
                    </nuxt-link>
                    <nuxt-link v-else to="/dashboard/projects">
                        <IconDashboard aria-hidden="true" />
                        Go to dashboard
                    </nuxt-link>
                </ButtonStyled>
            </div>
        </div>
        <div class="users-section-outer">
            <!-- <div class="projects-transition" /> -->
            <div class="users-section">
                <div class="section-header">
                    <div class="section-label green">The Server</div>
                    <h2 class="section-tagline">
                        Vanilla Minecraft, done right
                    </h2>
                    <p class="section-description">
                        No game-altering plugins, no pay-to-win. Just Minecraft
                        the way it was meant to be played — with a community
                        that's been going strong since 2017.
                    </p>
                </div>
                <div class="feature-blob">
                    <div class="blob-text">
                        <h3>Pure vanilla, the way it should be</h3>
                        <p>
                            No game-altering plugins. No economy systems, no
                            advantages you can buy, no shortcuts.
                        </p>
                        <p>
                            Fair play is strictly enforced — no hacks, no
                            cheats, no exploits. Just you and the game.
                        </p>
                    </div>
                    <div class="blob-demonstration gradient-border bigger">
                        <div class="demo-image no-aspect">
                            <img
                                src="/screenshots/spawn.webp"
                                alt="Pure vanilla gameplay"
                            />
                        </div>
                    </div>
                </div>
                <div class="feature-blob reverse">
                    <div class="blob-text">
                        <h3>Something to compete for every week</h3>
                        <p>
                            Every week players go head-to-head for glory and
                            bragging rights. Building contests, community
                            events, and more — there's always something going
                            on.
                        </p>
                    </div>
                    <div class="blob-demonstration gradient-border">
                        <div class="demo-image no-aspect">
                            <img
                                src="/screenshots/competition.webp"
                                alt="Weekly competition"
                            />
                        </div>
                    </div>
                </div>
                <div class="feature-blob">
                    <div class="blob-text">
                        <h3>A market built by players</h3>
                        <p>
                            No economy plugin, no admin shops. Our dedicated
                            market area at spawn is a real place, built entirely
                            by players from the ground up.
                        </p>
                        <p>
                            Bring your goods, set your prices, make your deals —
                            pure vanilla trade.
                        </p>
                        <p class="coming-soon-note">
                            Online shop display coming soon™
                        </p>
                    </div>
                    <div class="blob-demonstration gradient-border justify-between flex flex-col">
                        <div class="demo-image">
                            <img
                                src="/screenshots/SparkBound_Shop.webp"
                                alt="Player market"
                            />
                        </div>
                        <div class="results display-mode--list">
                            <ProjectCard
                                class="gradient-border"
                                id="teaser-shop"
                                name="Sparkbound"
                                description="One stop shop for enchanted books"
                                author="Elektraaa"
                                follows="42"
                                :coordinates="{ z: 17, x: 111 }"
                                icon-url="/screenshots/SparkBound.webp"
                                :categories="['books', 'armor', 'tools']"
                                updated-at="2026-05-30T15:21:49.098Z"
                                :show-created-date="false"
                                :search="true"
                                style="pointer-events: none; cursor: default"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="creator-section">
            <div class="section-header">
                <div class="section-label blue">The Community</div>
                <h2 class="section-tagline">A place worth applying for</h2>
                <p class="section-description">
                    Vanilla Tyme is whitelisted and application-only. Everyone
                    here chose to be here — and that makes all the difference.
                </p>
            </div>
            <div class="features">
                <div class="feature gradient-border">
                    <div class="icon gradient-border">
                        <IconCalendar style="color: #a7d0ff" aria-hidden="true" />
                    </div>
                    <h3>Running since 2017</h3>
                    <p>
                        9 years of continuous play. A server that's stood the
                        test of time and a community that's grown together over
                        almost a decade.
                    </p>
                </div>
                <div class="feature gradient-border">
                    <div class="icon gradient-border">
                        <IconShield style="color: #a7d0ff" aria-hidden="true" />
                    </div>
                    <h3>Safe &amp; Inclusive</h3>
                    <p>
                        Strict community standards enforced by an active staff
                        team. Zero tolerance for harassment or toxic behavior of
                        any kind.
                    </p>
                </div>
                <div class="feature gradient-border">
                    <div class="icon gradient-border">
                        <IconClipboardList style="color: #a7d0ff" aria-hidden="true" />
                    </div>
                    <h3>Application Only</h3>
                    <p>
                        Join our Discord, fill out an application, and get
                        approved by staff. No griefers, no randoms — everyone
                        here wants to be here.
                    </p>
                </div>
                <div class="feature gradient-border">
                    <div class="icon gradient-border">
                        <IconShieldCheck style="color: #a7d0ff" aria-hidden="true" />
                    </div>
                    <h3>Fair Play</h3>
                    <p>
                        No hacks, cheats, or exploits. All player actions are
                        logged. The integrity of the game is taken seriously —
                        play fair or don't play.
                    </p>
                </div>
            </div>
        </div>
        <div class="how-section">
            <div class="section-header">
                <div class="section-label green">Get Started</div>
                <h2 class="section-tagline">How to join</h2>
                <p class="section-description">
                    Vanilla Tyme is whitelisted. Here's how to get in.
                </p>
            </div>
            <div class="how-steps">
                <div class="how-step gradient-border card">
                    <div class="how-num">1</div>
                    <h3>Join our Discord</h3>
                    <p>
                        Head to our Discord server and read the rules in full
                        before applying.
                    </p>
                </div>
                <div class="how-step gradient-border card">
                    <div class="how-num">2</div>
                    <h3>Fill out an application</h3>
                    <p>
                        Complete the application. Put in the effort — low effort
                        applications get denied.
                    </p>
                </div>
                <div class="how-step gradient-border card">
                    <div class="how-num">3</div>
                    <h3>Get approved &amp; play</h3>
                    <p>
                        Once approved, link your account and jump in. Welcome to
                        the community.
                    </p>
                </div>
            </div>
        </div>
        <div class="join-cta">
            <h2 class="main-header">Ready to play?</h2>
            <p class="server-ip">play.vanillatyme.com</p>
            <p class="cta-sub">Apply through our Discord to get whitelisted.</p>
            <ButtonStyled color="brand" size="large">
                <a
                    href="https://discord.vanillatymeservers.com"
                    target="_blank"
                    rel="noopener"
                >
                    <!-- <IconBrandDiscord aria-hidden="true" /> -->
                    Join Discord &amp; Apply
                </a>
            </ButtonStyled>
            <p class="cta-since">Running strong since April 2017</p>
        </div>
    </div>
</template>
<script setup>
import ButtonStyled from "~/components/modrinth/ui/base/ButtonStyled.vue";
import {
    IconCompass,
    IconLogin2,
    IconDashboard,
    IconCalendar,
    IconShield,
    IconClipboardList,
    IconShieldCheck,
    IconBrandDiscord,
} from "@tabler/icons-vue";
import Avatar from "~/components/ui/Avatar.vue";
import ProjectCard from "~/components/ui/ProjectCard.vue";
const auth = await useAuth();
</script>

<style lang="scss" scoped>
.landing-hero {
    // background-image: var(--landing-maze-bg);
    // background-size: cover;
    object-fit: contain;
    padding: 6rem 1rem 12rem 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;

    .modrinth-icon {
        width: 13rem;
        height: 13rem;
        margin-bottom: 2.5rem;
    }

    h2 {
        font-size: 1.25rem;
        line-height: 125%;
        margin: 0 0 1.625rem;
        font-weight: 400;
        line-break: loose;
        color: var(--landing-color-subheading);
        max-width: 50rem;
    }

    .button-group {
        width: fit-content;
        gap: 1.25rem;
        margin: 0 auto 5rem;
        justify-content: center;
    }
}

.users-section-outer {
    position: relative;
    // background: var(--landing-maze-outer-bg);
    width: 100%;

    &:before {
        content: "";
        position: absolute;
        z-index: 1;
        inset: 0;
        background: linear-gradient(
            180deg,
            var(--landing-transition-gradient-end) 0%,
            var(--landing-transition-gradient-start) 100%
        );
        height: 12.5rem;
        width: 100%;
    }

    .projects-transition {
        position: absolute;
        top: calc(-12.5rem);
        width: 100%;
        height: 12.5rem;
        background: linear-gradient(
            0deg,
            var(--landing-transition-gradient-end) 0%,
            var(--landing-transition-gradient-start) 100%
        );
    }

    .projects-showcase {
        position: absolute;
        z-index: 2;
        top: -11rem;

        .row {
            --gap: 1.5rem;

            width: 100vw;
            gap: var(--gap);
            margin-bottom: var(--gap);

            display: flex;
            overflow: hidden;
            user-select: none;

            &:hover {
                .row__content {
                    animation-play-state: paused !important;
                }
            }

            .row__content {
                flex-shrink: 0;
                display: flex;
                min-width: 100%;
                gap: var(--gap);
                animation: scroll 40s linear infinite;

                @media (prefers-reduced-motion) {
                    animation-play-state: paused !important;
                }

                @keyframes scroll {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(calc(-100%));
                    }
                }

                &.offset {
                    animation: scroll-inverse 40s linear infinite;
                    transform: translateX(-100%);

                    @keyframes scroll-inverse {
                        from {
                            transform: translateX(calc(-100%));
                        }
                        to {
                            transform: translateX(calc(0%));
                        }
                    }
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

                &:hover {
                    z-index: -2;
                    background: var(--landing-hover-card-gradient);
                }

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
                    line-clamp: 2;
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

    .users-section {
        width: 100%;
        padding-top: 10rem;
        padding-bottom: 5rem;

        // background: var(--landing-maze-gradient-bg);
        background-size: cover;
        background-blend-mode: multiply;

        .feature-blob {
            display: flex;
            padding: 1.25rem 1rem;
            justify-content: center;
            flex-wrap: wrap;
            column-gap: 4.375rem;
            margin: 0 0.75rem 0.75rem 0.75rem;

            &.reverse {
                flex-direction: row-reverse;
            }

            .blob-text {
                margin-top: 2.5rem;
                width: 32.5rem;
                max-width: 32.5rem;
                text-align: center;

                h3 {
                    font-weight: 500;
                    font-size: 2rem;
                    line-height: 110%;
                    color: var(--landing-color-heading);
                }

                p {
                    font-weight: 400;
                    font-size: 1.25rem;
                    line-height: 125%;
                    color: var(--landing-color-subheading);
                    line-break: loose;
                }
            }

            @media screen and (min-width: 1238px) {
                padding: 5rem 1rem;

                .blob-text {
                    margin-top: 5rem;
                    text-align: left;
                }
            }

            .blob-demonstration {
                position: relative;
                width: 35rem;
                max-width: 35rem;
                background: var(--landing-blob-gradient);
                box-shadow: var(--landing-blob-shadow);
                // backdrop-filter: blur(6px);
                background-blend-mode: multiply;
                padding: 1rem;
                z-index: 1;

                &:after {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    inset: 0 0 -0.75rem -0.75rem;

                    background: linear-gradient(
                        0deg,
                        var(--color-brand) 0%,
                        rgba(5, 206, 69, 0) 100%
                    );
                    opacity: 0.2;
                    border-radius: 1rem;
                    margin-top: auto;
                    width: calc(100% + 1.5rem);
                    height: 55%;
                }

                .demo-search {
                    height: max-content;

                    .search-controls {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 1rem;
                        gap: 0.5rem;

                        .iconified-input {
                            width: 100%;

                            svg {
                                opacity: 1;
                                color: var(--color-button-text-active);
                            }

                            input {
                                box-shadow:
                                    inset 0 0 0 transparent,
                                    0 0 0 0.25rem var(--color-brand-shadow);
                                color: var(--color-button-text-active);
                            }
                        }

                        .sort-by {
                            display: flex;
                            gap: 0.75rem;
                            align-items: center;
                        }
                    }

                    .results {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;

                        .small-mode {
                            background: var(--landing-card-bg);
                            box-shadow: var(--landing-card-shadow);
                            background-blend-mode: multiply;
                            // backdrop-filter: blur(4px);
                        }

                        @media screen and (max-width: 450px) {
                            .small-mode:nth-child(n + 2) {
                                display: none;
                            }
                        }

                        @media screen and (max-width: 500px) {
                            .small-mode:nth-child(n + 3) {
                                display: none;
                            }
                        }
                    }
                }

                .notifs-demo {
                    h3 {
                        font-weight: 600;
                        font-size: 1.5rem;
                        margin: 0 0 0.75rem;
                    }

                    .notifications {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;

                        .notification {
                            display: flex;
                            gap: 1rem;
                            padding: 0.75rem;
                            background: var(--landing-card-bg);
                            box-shadow: var(--landing-card-shadow);

                            img {
                                width: 4rem;
                                height: 4rem;
                            }

                            .notif-header {
                                margin: 0;
                                font-weight: 600;
                                font-size: 1.25rem;
                            }

                            .notif-desc {
                                margin: 0.5rem 0;
                                font-weight: 500;
                                font-size: 1rem;
                            }

                            .date {
                                display: flex;
                                align-items: center;
                                gap: 0.25rem;

                                span {
                                    font-size: 12px;
                                    font-weight: 700;
                                }
                            }
                        }
                    }
                }

                .launcher-view {
                    .minecraft-screen {
                        width: 100%;
                        border-radius: 0.5rem;
                        aspect-ratio: 530 / 303;
                    }

                    .launcher-graphics {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 1rem;
                        gap: 0.5rem;

                        .graphic {
                            padding: 1.25rem;
                            display: flex;
                            align-items: center;
                            background: var(--landing-card-bg);
                            box-shadow: var(--landing-card-shadow);
                            //backdrop-filter: blur(4px);
                            margin: 0 auto;

                            img,
                            svg {
                                width: 4.25rem;
                                height: auto;
                                image-rendering: crisp-edges;
                            }
                        }
                    }
                }
            }
        }
    }
}

.creator-section {
    width: 100%;
    background: var(--landing-creator-gradient);
    padding: 2.5rem 0;

    .features {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        max-width: 81.25rem;
        justify-content: center;
        margin: 5rem auto 0 auto;
        row-gap: 3.5rem;
        column-gap: 3rem;
        padding: 1rem;

        .feature {
            width: 34.375rem;
            padding: 1.25rem;
            z-index: 1;
            background: var(--landing-card-bg);

            .icon {
                z-index: 2;
                margin: -3.25rem 0 0.75rem 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 4rem;
                height: 4rem;
                background: #020305;
                box-shadow:
                    2px 2px 12px rgba(0, 0, 0, 0.16),
                    inset 2px 2px 32px #393d5e;
                border-radius: 1rem;

                svg {
                    width: 2rem;
                    height: auto;
                }
            }

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
                font-weight: 500;
                line-height: 125%;
                margin: 0;
            }

            h3 {
                font-size: 1.25rem;
                color: var(--landing-color-heading);
                margin-bottom: 0.375rem;
            }

            p {
                font-size: 1.25rem;
                color: var(--landing-color-subheading);
            }
        }
    }
}

.logo-banner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--landing-raw-bg);
    padding: 1rem 1rem 2rem 1rem;
    overflow: hidden;

    .modrinth-icon {
        z-index: 2;
        width: auto;
        height: 32rem;
    }

    .overlay {
        z-index: 3;
        position: absolute;
        bottom: 8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1.5rem;
    }
}

.gradient-border {
    position: relative;
    border-radius: 1rem;

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

.section-header {
    text-align: center;
    margin: 2rem;

    .section-label {
        margin: 1.5rem auto;
        width: fit-content;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 700;
        font-size: 1rem;
        line-height: 125%;

        &.green {
            background: var(--landing-green-label-bg);
            color: var(--landing-green-label);
        }

        &.blue {
            background: var(--landing-blue-label-bg);
            color: var(--landing-blue-label);
        }
    }

    .section-tagline,
    .section-description {
        font-weight: 400;
        font-size: 1.25rem;
        line-break: loose;
        line-height: 125%;
        max-width: 50rem;
    }

    .section-tagline {
        margin: 0 auto;
        color: var(--landing-color-heading);
    }

    .section-description {
        margin: 0.375rem auto;
        color: var(--landing-color-subheading);
    }
}

.main-header {
    color: var(--landing-color-heading);
    font-size: 2.25rem;
    font-weight: 600;
    line-height: 100%;
    margin: 0 0 0.25rem;
    width: 100%;
}

.main-header-strong {
    font-weight: 600;
    background-color: var(--color-brand);
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
    white-space: nowrap;
}

.animate-strong {
    height: 1.2em;
    line-height: 120%;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;

    > span {
        position: absolute;
        top: 0;
        animation: slide 14s infinite;

        @media (prefers-reduced-motion) {
            animation-play-state: paused !important;
        }
    }

    @keyframes slide {
        0%,
        12.5% {
            top: 0;
        }
        14.3%,
        26.8% {
            top: -1.2em;
        }
        28.6%,
        41.1% {
            top: -2.4em;
        }
        42.9%,
        55.4% {
            top: -3.6em;
        }
        57.2%,
        69.7% {
            top: -4.8em;
        }
        71.5%,
        84% {
            top: -6em;
        }
        85.8%,
        98.3% {
            top: -7.2em;
        }
        100% {
            top: -8.4em;
        }
    }
}

@media screen and (min-width: 560px) {
    .landing-hero {
        h2 {
            font-size: 1.5rem;
        }
    }

    .users-section-outer {
        .users-section {
            .feature-blob {
                .blob-text {
                    h3 {
                        font-size: 3rem;
                    }

                    p {
                        font-size: 1.5rem;
                    }
                }

                .blob-demonstration {
                    .demo-search {
                        min-height: 37.5rem;
                    }

                    .launcher-view {
                        .launcher-graphics {
                            .graphic {
                                margin: 0;
                                padding: 1.25rem 2.75rem;
                            }
                        }
                    }

                    .notifs-demo {
                        .notifications .notification .avatar {
                            width: 5rem;
                            height: 5rem;
                        }
                    }
                }
            }
        }
    }

    .logo-banner {
        padding: 3rem 1rem 3.75rem 1rem;

        .overlay {
            bottom: 3.5rem;
        }
    }

    .section-header {
        .section-tagline,
        .section-description {
            font-size: 1.5rem;
        }
    }

    .main-header {
        font-size: 4rem;
    }
}

@media screen and (min-width: 1024px) {
    .landing-hero {
        h2 {
            font-size: 1.625rem;
        }

        margin-top: -5rem;
        padding: 11.25rem 1rem 1rem;
    }

    .users-section-outer {
        .users-section {
            .feature-blob {
                .blob-text {
                    h3 {
                        font-size: 4rem;
                    }

                    p {
                        font-size: 1.625rem;
                    }
                }
            }
        }
    }

    .creator-section {
        .features {
            margin-top: 7rem;
            row-gap: 5.5rem;

            .feature {
                min-height: 12rem;

                .icon {
                    margin-bottom: 1.25rem;
                    width: 5rem;
                    height: 5rem;

                    svg {
                        width: 2.25rem;
                    }
                }

                .additional-label {
                    position: absolute;
                    top: 12px;
                    left: 112px;
                    margin-bottom: 0;
                }

                h3 {
                    font-size: 1.75rem;
                }

                p {
                    font-size: 1.25rem;
                }
            }
        }
    }

    .logo-banner {
        padding: 4rem 1rem 6.75rem 1rem;

        .overlay {
            bottom: 5rem;
        }
    }

    .section-header {
        .section-tagline,
        .section-description {
            font-size: 1.625rem;
        }
    }

    .main-header {
        font-size: 5.25rem;
    }
}
.demo-image {
    img {
        width: 100%;
        border-radius: 0.625rem;
        aspect-ratio: 16 / 10;
        object-fit: cover;
    }
}
.demo-image.no-aspect {
    img {
        aspect-ratio: unset;
    }
}

.coming-soon-note {
    color: var(--color-orange);
    font-weight: 600;
    font-size: 1rem;
    margin: 0;
}

.how-section {
    width: 100%;
    background: var(--landing-creator-gradient);
    padding: 2.5rem 0 5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    .how-steps {
        display: flex;
        flex-wrap: wrap;
        max-width: 81.25rem;
        justify-content: center;
        margin: 3rem auto 0;
        gap: 3rem;
        padding: 1rem;
    }

    .how-step {
        width: 22rem;
        padding: 1.25rem;
        background: var(--landing-card-bg);

        .how-num {
            width: 3rem;
            height: 3rem;
            background: var(--color-brand);
            color: var(--color-accent-contrast);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }

        h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--landing-color-heading);
            margin: 0 0 0.375rem;
        }

        p {
            font-size: 1rem;
            color: var(--landing-color-subheading);
            margin: 0;
        }
    }
}

.join-cta {
    width: 100%;
    background: var(--landing-raw-bg);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 6rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;

    .server-ip {
        font-family: monospace;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-brand);
        background: var(--color-brand-highlight);
        padding: 0.5rem 1.75rem;
        border-radius: 0.5rem;
        margin: 0;
    }

    .cta-sub {
        color: var(--landing-color-subheading);
        font-size: 1.1rem;
        margin: 0;
    }

    .cta-since {
        color: var(--landing-color-subheading);
        font-size: 0.875rem;
        margin: 0;
        opacity: 0.5;
    }
}

.feature .icon {
    :deep(svg) {
        width: 2rem;
        height: auto;
        color: var(--landing-color-heading);
    }
}
</style>
