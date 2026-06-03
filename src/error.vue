<template>
	<NuxtLayout>
		<LoadingBar />
		<!-- <NotificationPanel /> -->
		<div class="main">
			<div v-if="is404" class="error-graphic">
				<Logo404 />
			</div>
			<div class="error-box" :class="{ 'has-bot': !is404 }">
				<div v-if="!is404" class="error-box__top-glow" />
				<div class="error-box__body">
					<h1 class="error-box__title">{{ errorMessages.title }}</h1>
					<p v-if="errorMessages.subtitle" class="error-box__subtitle">
						{{ errorMessages.subtitle }}
					</p>
				</div>
				<div v-if="is401" class="flex flex-col gap-4">
					<template v-if="!auth.user">
						<ButtonStyled color="brand">
							<nuxt-link class="button-like w-fit" :to="signInRoute">
								<IconLogin />
								Sign in
							</nuxt-link>
						</ButtonStyled>
					</template>
				</div>
				<div class="error-box__body">
					<p v-if="errorMessages.list_title" class="error-box__list-title">
						{{ errorMessages.list_title }}
					</p>
					<ul v-if="errorMessages.list_items" class="error-box__list">
						<li v-for="item in errorMessages.list_items" :key="item" v-html="item" />
					</ul>
				</div>
				<div v-if="!is404" class="error-box__details">
					<p>Error {{ error.statusCode }}</p>
					<p>{{ error.message }}</p>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
import { IconLogin } from '@tabler/icons-vue'
// import {
// 	NotificationPanel,
// 	provideNotificationManager,
// 	providePageContext,
// } from '@modrinth/ui'
import ButtonStyled from '~/components/modrinth/ui/base/ButtonStyled.vue'
import LoadingBar from '~/components/modrinth/ui/base/LoadingBar.vue'

import Logo404 from '~/components/brand/404.vue'
import { getSignInRouteObj } from '~/composables/auth.js'

// import { createModrinthClient } from './helpers/api.ts'
// import { FrontendNotificationManager } from './providers/frontend-notifications.ts'
// import { setupLoadingStateProvider } from '~/providers/setup/loading-state.ts'

const auth = await useAuth()
const config = useRuntimeConfig()

// provideNotificationManager(new FrontendNotificationManager())
// setupLoadingStateProvider()

// const client = createModrinthClient(auth.value, {
// 	apiBaseUrl: config.public.apiBaseUrl.replace('/v2/', '/'),
// 	archonBaseUrl: config.public.pyroBaseUrl.replace('/v2/', '/'),
// 	rateLimitKey: config.rateLimitKey,
// })
// providePageContext({
// 	hierarchicalSidebarAvailable: ref(false),
// 	showAds: ref(false),
// 	openExternalUrl: (url) => window.open(url, '_blank'),
// })


const props = defineProps({
	error: {
		type: Object,
		default() {
			return {
				statusCode: 1000,
				message: 'Unknown error',
			}
		},
	},
})

const is404 = computed(() => props.error.statusCode === 404)
const is401 = computed(() => props.error.statusCode === 401)

const signInRoute = computed(() => getSignInRouteObj(route))

const errorMessages = computed(
	() =>
		routeMessages.find((x) => x.match(route))?.messages[props.error.statusCode] ??
		messages[props.error.statusCode] ??
		messages.default,
)

const route = useRoute()

const messages = {
	404: {
		title: 'Page not found',
		subtitle: "The page you were looking for doesn't seem to exist.",
	},
	451: {
		title: 'Content unavailable for legal reasons',
		subtitle: 'This page has been blocked for legal reasons, such as government censorship or ongoing legal proceedings.',
	},
	401: {
		title: `You don't have access to this page`,
	},
	default: {
		title: 'Uh oh!',
		subtitle: 'Something went wrong.',
		list_title: 'Please try again in a few minutes.',
		list_items: [
			'Check if VanillaTyme is down on our <a href="https://status.vanillatyme.com" target="_blank" rel="noopener">Status page</a>.',
			'If this keeps happening, join our <a href="https://discord.vanillatymeservers.com" target="_blank" rel="noopener">Discord server</a> and let us know.',
		],
	},
}

const PROJECT_PATH_PREFIXES = [
	'/shop/'
]

const routeMessages = [
	{
		match: (route) => PROJECT_PATH_PREFIXES.some((prefix) => route.path.startsWith(prefix)),
		messages: {
			404: {
				title: 'Shop not found',
				list_title: 'Why?',
				list_items: [
					"You may have mistyped the shop's URL.",
					"The shop's owner may have changed the URL, made it private, or deleted it.",
					'The shop may have been removed by VanillaTyme staff for violating our <a href="/legal/terms" target="_blank" rel="noopener">Terms of Use</a>.',
				],
			},
		},
	},
]
</script>

<style lang="scss" scoped>
.main {
	margin: var(--spacing-card-lg) auto;
	width: calc(100% - 4rem);
	min-height: min(90vh, 30rem);
	display: flex;
	flex-direction: column;
	justify-content: center;

	@media screen and (min-width: 800px) {
		width: 600px;
	}
}

.error-graphic {
	margin-bottom: 2rem;
	display: flex;
	justify-content: center;

	svg {
		fill: var(--color-text);
		color: var(--color-text);
		width: min(15rem, 100%);
		height: auto;
	}
}

.error-box {
	background-color: var(--color-raised-bg);
	border-radius: 1.25rem;
	padding: 1.75rem 2rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	box-shadow: var(--shadow-card);
	position: relative;

	&.has-bot {
		margin-block: 120px;
	}

	p {
		margin: 0;
	}

	a:not(.button-like) {
		color: var(--color-brand);
		font-weight: 600;

		&:hover,
		&:focus {
			filter: brightness(1.125);
			text-decoration: underline;
		}
	}

	&__sad-bot {
		--_bot-height: 112px;
		position: absolute;
		top: calc(-1 * var(--_bot-height));
		right: 5rem;
		width: auto;
		height: var(--_bot-height);

		@media screen and (max-width: 768px) {
			--_bot-height: 70px;
			right: 2rem;
		}
	}

	&__top-glow {
		width: 100%;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent 2rem,
			var(--color-green) calc(100% - 13rem),
			var(--color-green) calc(100% - 5rem),
			transparent calc(100% - 2rem)
		);
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.4;
	}

	&__title {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	&__subtitle {
		font-size: 1rem;
		font-weight: 400;
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		&:empty {
			display: none;
		}
	}

	&__list-title {
		font-weight: 600;
	}

	&__list {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-left: 1.25rem;
	}

	li {
		line-height: 1.5;
	}

	&__details {
		display: flex;
		flex-direction: column;
		color: var(--color-secondary);
		gap: 0.25rem;
		font-weight: 500;
		font-size: 0.875rem;
	}
}
</style>