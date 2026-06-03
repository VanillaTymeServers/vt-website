<script setup>
import { IconMoon, IconSun, IconCircleDot, IconCircle } from '@tabler/icons-vue'
// import { useVIntl, defineMessages } from '@vintl/vintl'

// const { formatMessage } = useVIntl()

defineProps({
  updateColorTheme: {
    type: Function,
    required: true,
  },
  currentTheme: {
    type: String,
    required: true,
  },
  themeOptions: {
    type: Array,
    required: true,
  },
  systemThemeColor: {
    type: String,
    required: true,
  },
})

const themeLabels = {
  system: 'Sync with system',
  light: 'Light',
  dark: 'Dark',
  retro: 'Retro',
  oled: 'OLED',
};
</script>

<template>
  <div class="theme-options mt-4">
    <button
      v-for="option in themeOptions"
      :key="option"
      class="preview-radio button-base"
      :class="{ selected: currentTheme === option }"
      @click="() => updateColorTheme(option)"
    >
      <div class="preview" :class="`${option === 'system' ? systemThemeColor : option}-mode`">
        <div class="example-card card card">
          <div class="example-icon"></div>
          <div class="example-text-1"></div>
          <div class="example-text-2"></div>
        </div>
      </div>
      <div class="label">
        <IconCircleDot v-if="currentTheme === option" class="radio" />
        <IconCircle v-else class="radio" />
        {{ themeLabels[option] || option }}
        <IconSun
          v-if="'light' === option"
          v-tooltip="'Preferred light theme'"
          class="theme-icon"
        />
        <IconMoon
          v-else-if="'dark' === option"
          v-tooltip="'Preferred dark theme'"
          class="theme-icon"
        />
      </div>
    </button>
  </div>
</template>

<style scoped lang="scss">
.theme-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--gap-lg);

  .preview .example-card {
    margin: 0;
    padding: 1rem;
    display: grid;
    grid-template: 'icon text1' 'icon text2';
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    outline: 2px solid transparent;

    .example-icon {
      grid-area: icon;
      width: 2rem;
      height: 2rem;
      background-color: var(--color-button-bg);
      border-radius: var(--radius-sm);
      outline: 2px solid transparent;
    }

    .example-text-1,
    .example-text-2 {
      height: 0.5rem;
      border-radius: var(--radius-sm);
      outline: 2px solid transparent;
    }

    .example-text-1 {
      grid-area: text1;
      width: 100%;
      background-color: var(--color-base);
    }

    .example-text-2 {
      grid-area: text2;
      width: 60%;
      background-color: var(--color-secondary);
    }
  }
}
</style>
