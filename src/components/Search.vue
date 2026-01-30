<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref, watch } from "vue";
import type { SearchResult } from "@/global";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { url } from "@/utils/url-utils";

const keywordDesktop = ref("");
const keywordMobile = ref("");
const result = ref<SearchResult[]>([]);
const isSearching = ref(false);
const pagefindLoaded = ref(false);
const initialized = ref(false);

const fakeResult: SearchResult[] = [
  {
    url: url("/"),
    meta: { title: "This Is a Fake Search Result" },
    excerpt:
      "Because the search cannot work in the <mark>dev</mark> environment.",
  },
  {
    url: url("/"),
    meta: { title: "If You Want to Test the Search" },
    excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
  },
];

function togglePanel() {
  const panel = document.getElementById("search-panel");
  panel?.classList.toggle("float-panel-closed");
}

function setPanelVisibility(show: boolean, isDesktop: boolean): void {
  const panel = document.getElementById("search-panel");
  if (!panel || !isDesktop) return;

  if (show) panel.classList.remove("float-panel-closed");
  else panel.classList.add("float-panel-closed");
}

async function doSearch(keyword: string, isDesktop: boolean): Promise<void> {
  if (!keyword) {
    setPanelVisibility(false, isDesktop);
    result.value = [];
    return;
  }

  if (!initialized.value) return;

  isSearching.value = true;

  try {
    let searchResults: SearchResult[] = [];

    if (import.meta.env.PROD && pagefindLoaded.value && window.pagefind) {
      const response = await window.pagefind.search(keyword);
      searchResults = await Promise.all(
        response.results.map((item) => item.data()),
      );
    } else if (import.meta.env.DEV) {
      searchResults = fakeResult;
    } else {
      searchResults = [];
      console.error("Pagefind is not available in production environment.");
    }

    result.value = searchResults;
    setPanelVisibility(result.value.length > 0, isDesktop);
  } catch (error) {
    console.error("Search error:", error);
    result.value = [];
    setPanelVisibility(false, isDesktop);
  } finally {
    isSearching.value = false;
  }
}

onMounted(() => {
  const initializeSearch = () => {
    initialized.value = true;
    pagefindLoaded.value =
      typeof window !== "undefined" &&
      !!window.pagefind &&
      typeof window.pagefind.search === "function";
    if (keywordDesktop.value) doSearch(keywordDesktop.value, true);
    if (keywordMobile.value) doSearch(keywordMobile.value, false);
  };

  if (import.meta.env.DEV) {
    console.log(
      "Pagefind is not available in development mode. Using mock data.",
    );
    initializeSearch();
  } else {
    document.addEventListener("pagefindready", () => initializeSearch());
    document.addEventListener("pagefindloaderror", () => initializeSearch());

    // fallback
    setTimeout(() => {
      if (!initialized.value) initializeSearch();
    }, 2000);
  }
});

watch(keywordDesktop, async (val) => {
  if (initialized.value && val) await doSearch(val, true);
  if (initialized.value && !val) doSearch(val, true);
});

watch(keywordMobile, async (val) => {
  if (initialized.value && val) await doSearch(val, false);
  if (initialized.value && !val) doSearch(val, false);
});
</script>

<template>
  <!-- search bar for desktop view -->
  <div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/4 hover:bg-black/6 focus-within:bg-black/6
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
    <Icon icon="material-symbols:search"
      class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30" />
    <input :placeholder="i18n(I18nKey.search)" v-model="keywordDesktop" @focus="() => doSearch(keywordDesktop, true)"
      class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50" />
  </div>

  <!-- toggle btn for phone/tablet view -->
  <button @click="togglePanel" aria-label="Search Panel" id="search-switch"
    class="btn-plain scale-animation lg:hidden! rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]" />
  </button>

  <!-- search panel -->
  <div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-120
  top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/4 hover:bg-black/6 focus-within:bg-black/6
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
    ">
      <Icon icon="material-symbols:search"
        class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30" />
      <input placeholder="Search" v-model="keywordMobile" class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50" />
    </div>

    <!-- search results -->
    <template v-for="item in result" :key="item.url">
      <a :href="item.url" class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active)">
        <div class="transition text-90 inline-flex font-bold group-hover:text-(--primary)">
          {{ item.meta.title }}
          <Icon icon="fa6-solid:chevron-right"
            class="transition text-[0.75rem] translate-x-1 my-auto text-(--primary)" />
        </div>
        <div class="transition text-sm text-50" v-html="item.excerpt"></div>
      </a>
    </template>
  </div>
</template>

<style>
input:focus {
  outline: 0;
}

.search-panel {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
