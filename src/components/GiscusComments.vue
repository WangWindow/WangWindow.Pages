<script setup>
import Giscus from "@giscus/vue";
import { giscusConfig, siteConfig } from "src/config";
import { onMounted, onUnmounted, ref } from "vue";

const normalizedLang = (giscusConfig.lang || siteConfig.lang || "en").replace(
  "_",
  "-",
);
const hasRequired =
  giscusConfig.repo &&
  giscusConfig.repoId &&
  giscusConfig.category &&
  giscusConfig.categoryId;
const shouldRender = giscusConfig.enable && hasRequired;

const themeLight = giscusConfig.theme?.light ?? "light";
const themeDark = giscusConfig.theme?.dark ?? "dark";
const currentTheme = ref(themeLight);

onMounted(() => {
  const getTheme = () =>
    document.documentElement.classList.contains("dark")
      ? themeDark
      : themeLight;
  currentTheme.value = getTheme();

  const observer = new MutationObserver(() => {
    currentTheme.value = getTheme();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <section v-if="shouldRender" class="mt-6" aria-label="Comments">
    <Giscus :repo="giscusConfig.repo" :repo-id="giscusConfig.repoId" :category="giscusConfig.category"
      :category-id="giscusConfig.categoryId" :mapping="giscusConfig.mapping" :strict="giscusConfig.strict"
      :reactions-enabled="giscusConfig.reactionsEnabled" :emit-metadata="giscusConfig.emitMetadata"
      :input-position="giscusConfig.inputPosition" :theme="currentTheme" :lang="normalizedLang" loading="lazy" />
  </section>
</template>
