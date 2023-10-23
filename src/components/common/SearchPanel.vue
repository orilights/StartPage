<template>
  <div
    class="relative border rounded-full flex items-center justify-center h-[50px] transition-shadow shadow-sm bg-white max-w-2xl"
    :class="{
      '!shadow-md': focusOnSearchInput,
      'hover:shadow-md': !focusOnSearchInput,
    }"
    @wheel.passive="handleWheel"
  >
    <button
      class="p-3 transition-colors rounded-full hover:bg-gray-200"
      @click.stop="showSearchProviderList = !showSearchProviderList"
      @contextmenu.prevent="showSearchProviderList = true"
    >
      <img :src="searchProviders[currentSearchProviderIndex].icon" class="w-6 h-6">
    </button>
    <input
      ref="searchInput" v-model="searchStr" class="outline-none px-1 flex-1 h-[48px]"
      type="text"
      :placeholder="`使用 ${searchProviders[currentSearchProviderIndex].name} 搜索, 按下 / 聚焦到搜索框, 按下 Tab 切换搜索引擎`"
      @focus="focusOnSearchInput = true"
      @blur="focusOnSearchInput = false"
      @keydown.enter="handleSearch"
      @keydown.tab.prevent="switchSearchProvider()"
    >
    <button class="p-3 transition-colors rounded-full hover:bg-gray-200" @click="handleSearch">
      <Search24Regular class="w-6 h-6 text-[#707070]" />
    </button>
    <Transition name="popup-top">
      <div
        v-if="showSearchProviderList"
        class="flex gap absolute left-0 top-[52px] border rounded-full bg-white shadow-md z-50"
      >
        <button
          v-for="provider, index in searchProviders" :key="provider.name" class="p-3 transition-colors rounded-full"
          :class="{
            'bg-gray-300': provider === searchProviders[currentSearchProviderIndex],
            'hover:bg-gray-200': provider !== searchProviders[currentSearchProviderIndex],
          }" @click.stop="currentSearchProviderIndex = index"
        >
          <img :src="provider.icon" :alt="provider.name" class="w-6 h-6">
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Search24Regular } from '@vicons/fluent'
import type { SearchProvider } from '@/types'

const searchProviders = ref<SearchProvider[]>([
  {
    name: 'Google',
    url: 'https://www.google.com/search?q={keyword}',
    icon: '/icon/google-line.png',
  },
  {
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd={keyword}',
    icon: '/icon/baidu-line.png',
  },
  {
    name: 'Bilibili',
    url: 'https://search.bilibili.com/all?keyword={keyword}',
    icon: '/icon/bilibili-line.png',
  },
])

const focusOnSearchInput = ref(false)
const currentSearchProviderIndex = ref(0)
const showSearchProviderList = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const searchStr = ref('')

onMounted(() => {
  searchInput.value?.focus()
  document.addEventListener('click', () => {
    showSearchProviderList.value = false
  })
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === '/' && !focusOnSearchInput.value) {
      e.preventDefault()
      searchInput.value?.focus()
    }
  })
})

const hideSearchProviderList = useDebounceFn(() => {
  showSearchProviderList.value = false
}, 800)

function handleWheel(e: WheelEvent) {
  switchSearchProvider(e.deltaY > 0)
}

function switchSearchProvider(next = true) {
  showSearchProviderList.value = true

  if (next)
    currentSearchProviderIndex.value++
  else
    currentSearchProviderIndex.value--

  if (currentSearchProviderIndex.value < 0)
    currentSearchProviderIndex.value = searchProviders.value.length - 1

  else if (currentSearchProviderIndex.value >= searchProviders.value.length)
    currentSearchProviderIndex.value = 0

  hideSearchProviderList()
}

function handleSearch() {
  const url = searchProviders.value[currentSearchProviderIndex.value].url
    .replace('{keyword}', encodeURIComponent(searchStr.value))
  window.open(url)
}
</script>

<style>
.popup-top-enter-active,
.popup-top-leave-active {
  transition: all 0.3s;
}

.popup-top-enter-from,
.popup-top-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
