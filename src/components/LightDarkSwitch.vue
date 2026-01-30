<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@/constants/constants";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import {
  applyThemeToDocument,
  getStoredTheme,
  setTheme,
} from "@/utils/setting-utils";

type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE | typeof AUTO_MODE;
const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
const mode = ref<LIGHT_DARK_MODE>(AUTO_MODE as LIGHT_DARK_MODE);

onMounted(() => {
  mode.value = getStoredTheme() as LIGHT_DARK_MODE;
  const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
  const changeThemeWhenSchemeChanged = () => applyThemeToDocument(mode.value);
  darkModePreference.addEventListener("change", changeThemeWhenSchemeChanged);
  // cleanup not strictly necessary in Astro static render, but add it
  window.addEventListener("beforeunload", () => {
    darkModePreference.removeEventListener(
      "change",
      changeThemeWhenSchemeChanged,
    );
  });
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
  mode.value = newMode;
  setTheme(newMode);
}

function toggleScheme() {
  let i = seq.indexOf(mode.value);
  switchScheme(seq[(i + 1) % seq.length]);
}

function showPanel() {
  const panel = document.querySelector("#light-dark-panel");
  panel?.classList.remove("float-panel-closed");
}

function hidePanel() {
  const panel = document.querySelector("#light-dark-panel");
  panel?.classList.add("float-panel-closed");
}
</script>

<template>
  <div class="relative z-50" role="menu" tabindex="-1" @mouseleave="hidePanel">
    <button aria-label="Light/Dark Mode" role="menuitem"
      class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="scheme-switch"
      @click="toggleScheme" @mouseenter="showPanel">
      <div :class="{ 'opacity-0': mode.valueOf() !== LIGHT_MODE }" class="absolute">
        <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]" />
      </div>
      <div :class="{ 'opacity-0': mode.valueOf() !== DARK_MODE }" class="absolute">
        <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]" />
      </div>
      <div :class="{ 'opacity-0': mode.valueOf() !== AUTO_MODE }" class="absolute">
        <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem]" />
      </div>
    </button>

    <div id="light-dark-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5">
      <div class="card-base float-panel p-2">
        <button @click="() => switchScheme(LIGHT_MODE)" :class="{ 'current-theme-btn': mode.valueOf() === LIGHT_MODE }"
          class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5">
          <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3" />
          {{ i18n(I18nKey.lightMode) }}
        </button>
        <button @click="() => switchScheme(DARK_MODE)" :class="{ 'current-theme-btn': mode.valueOf() === DARK_MODE }"
          class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5">
          <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3" />
          {{ i18n(I18nKey.darkMode) }}
        </button>
        <button @click="() => switchScheme(AUTO_MODE)" :class="{ 'current-theme-btn': mode.valueOf() === AUTO_MODE }"
          class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95">
          <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem] mr-3" />
          {{ i18n(I18nKey.systemMode) }}
        </button>
      </div>
    </div>
  </div>
</template>
