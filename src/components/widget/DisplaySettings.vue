<script setup lang="ts">
import { ref, watch } from "vue";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { Icon } from "@iconify/vue";
import { getDefaultHue, getHue, setHue } from "@/utils/setting-utils";

const hue = ref<number>(getHue());
const defaultHue = getDefaultHue();

function resetHue() {
    hue.value = defaultHue;
}

watch(hue, (v) => {
    if (v || v === 0) setHue(v);
});
</script>

<template>
    <div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
        <div class="flex flex-row gap-2 mb-3 items-center justify-between">
            <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3">
                {{ i18n(I18nKey.themeColor) }}
                <button aria-label="Reset to Default"
                    class="btn-regular w-7 h-7 rounded-md  active:scale-90 will-change-transform"
                    :class="{ 'opacity-0': hue === defaultHue, 'pointer-events-none': hue === defaultHue }"
                    @click="resetHue">
                    <div class="text-(--btn-content)">
                        <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]" />
                    </div>
                </button>
            </div>
            <div class="flex gap-1">
                <div id="hueValue"
                    class="transition bg-(--btn-regular-bg) w-10 h-7 rounded-md flex justify-center font-bold text-sm items-center text-(--btn-content)">
                    {{ hue }}</div>
            </div>
        </div>
        <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
            <input aria-label="{{ i18n(I18nKey.themeColor) }}" type="range" min="0" max="360" v-model.number="hue"
                class="slider" id="colorSlider" step="5" style="width: 100%" />
        </div>
    </div>
</template>

<style lang="stylus" scoped>
#display-setting
input[type="range"]
    -webkit-appearance none
    height 1.5rem
    background-image var(--color-selection-bar)
    transition background-image 0.15s ease-in-out

    /* Input Thumb */
    &::-webkit-slider-thumb
    -webkit-appearance none
    height 1rem
    width 0.5rem
    border-radius 0.125rem
    background rgba(255, 255, 255, 0.7)
    box-shadow none
    &:hover
        background rgba(255, 255, 255, 0.8)
    &:active
        background rgba(255, 255, 255, 0.6)

    &::-moz-range-thumb
    -webkit-appearance none
    height 1rem
    width 0.5rem
    border-radius 0.125rem
    border-width 0
    background rgba(255, 255, 255, 0.7)
    box-shadow none
    &:hover
        background rgba(255, 255, 255, 0.8)
    &:active
        background rgba(255, 255, 255, 0.6)

    &::-ms-thumb
    -webkit-appearance none
    height 1rem
    width 0.5rem
    border-radius 0.125rem
    background rgba(255, 255, 255, 0.7)
    box-shadow none
    &:hover
        background rgba(255, 255, 255, 0.8)
    &:active
        background rgba(255, 255, 255, 0.6)
</style>
