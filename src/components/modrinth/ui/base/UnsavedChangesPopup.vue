<script setup lang="ts" generic="T">
import { isEqual } from 'es-toolkit'
import { type Component, computed } from 'vue'

import ButtonStyled from './ButtonStyled.vue'
import FloatingActionBar from './FloatingActionBar.vue'
import { IconDeviceFloppy, IconHistory } from '@tabler/icons-vue'

const emit = defineEmits<{
	(e: 'reset' | 'save', event: MouseEvent): void
}>()

const props = withDefaults(
	defineProps<{
		canReset?: boolean
		original: T
		modified: Partial<T>
		saving?: boolean
		text?: string
		saveLabel?: string
		savingLabel?: string
		saveIcon?: Component
	}>(),
	{
		canReset: true,
		saving: false,
		text: () => 'You have unsaved changes.',
		saveLabel: () => 'Save',
		savingLabel: () => 'Saving',
		saveIcon: IconDeviceFloppy,
	},
)

const shown = computed(() =>
	Object.keys(props.modified).some((key) => !isEqual(props.original[key], props.modified[key])),
)
</script>

<template>
	<FloatingActionBar :shown="shown">
		<p class="m-0 font-semibold text-sm md:text-base">{{ text }}</p>
		<div class="ml-auto flex gap-2">
			<ButtonStyled v-if="canReset" type="transparent">
				<button :disabled="saving" @click="(e) => emit('reset', e)">
					<IconHistory /> Reset
				</button>
			</ButtonStyled>
			<ButtonStyled color="brand">
				<button :disabled="saving" @click="(e) => emit('save', e)">
					<IconLoader2 v-if="saving" class="animate-spin" />
					<component :is="saveIcon" v-else />
					{{ saving ? savingLabel : saveLabel }}
				</button>
			</ButtonStyled>
		</div>
	</FloatingActionBar>
</template>
