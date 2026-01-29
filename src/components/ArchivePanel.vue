<script setup lang="ts">
import { onMounted, ref } from "vue";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

interface Post {
    slug: string;
    data: {
        title: string;
        tags: string[];
        category?: string;
        published: Date;
    };
}

interface Group {
    year: number;
    posts: Post[];
}

// props are passed from the page; fallback to empty arrays if not provided
const props = defineProps<{
    tags?: string[];
    categories?: string[];
    sortedPosts?: Post[];
}>();

const groups = ref<Group[]>([]);

function formatDate(date: Date) {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
    return tagList.map((t) => `#${t}`).join(" ");
}

onMounted(() => {
    // read params from url if present
    const params = new URLSearchParams(window.location.search);
    const tags = params.has("tag") ? params.getAll("tag") : props.tags || [];
    const categories = params.has("category") ? params.getAll("category") : props.categories || [];
    const uncategorized = params.get("uncategorized");

    let filteredPosts: Post[] = props.sortedPosts || [];

    if (tags.length > 0) {
        filteredPosts = filteredPosts.filter(
            (post) => Array.isArray(post.data.tags) && post.data.tags.some((tag) => tags.includes(tag)),
        );
    }

    if (categories.length > 0) {
        filteredPosts = filteredPosts.filter(
            (post) => post.data.category && categories.includes(post.data.category),
        );
    }

    if (uncategorized) {
        filteredPosts = filteredPosts.filter((post) => !post.data.category);
    }

    const grouped: Record<number, Post[]> = filteredPosts.reduce((acc, post) => {
        const year = post.data.published.getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {} as Record<number, Post[]>);

    const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
        year: Number.parseInt(yearStr, 10),
        posts: grouped[Number.parseInt(yearStr, 10)],
    }));

    groupedPostsArray.sort((a, b) => b.year - a.year);

    groups.value = groupedPostsArray;
});
</script>

<template>
    <div class="card-base px-8 py-6">
        <div v-for="group in groups" :key="group.year">
            <div>
                <div class="flex flex-row w-full items-center h-15">
                    <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">{{ group.year }}
                    </div>
                    <div class="w-[15%] md:w-[10%]">
                        <div
                            class="h-3 w-3 bg-none rounded-full outline-(--primary) mx-auto-outline-offset-2 z-50 outline-3">
                        </div>
                    </div>
                    <div class="w-[70%] md:w-[80%] transition text-left text-50">{{ group.posts.length }} {{
                        i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount) }}</div>
                </div>

                <div v-for="post in group.posts" :key="post.slug">
                    <a :href="getPostUrlBySlug(post.slug)" :aria-label="post.data.title"
                        class="group btn-plain block! h-10 w-full rounded-lg hover:text-[initial]">
                        <div class="flex flex-row justify-start items-center h-full">
                            <!-- date -->
                            <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">{{
                                formatDate(post.data.published)
                                }}</div>

                            <!-- dot and line -->
                            <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                                <div class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                            bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-(--primary)
                            outline z-50
                            outline-(--card-bg)
                            group-hover:outline-(--btn-plain-bg-hover)
                            group-active:outline-(--btn-plain-bg-active)"></div>
                            </div>

                            <!-- post title -->
                            <div class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-(--primary)
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden">
                                {{ post.data.title }}
                            </div>

                            <!-- tag list -->
                            <div
                                class="hidden md:block md:w-[15%] text-left text-sm transition whitespace-nowrap overflow-ellipsis overflow-hidden text-30">
                                {{ formatTag(post.data.tags) }}</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
