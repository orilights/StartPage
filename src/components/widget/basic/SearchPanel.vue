<template>
  <div class="relative h-[50px] max-w-2xl z-40">
    <div
      class="border rounded-[25px] bg-white transition-all shadow-sm ease-out overflow-hidden"
      :class="{
        '!shadow-md': focusOnSearchInput,
        'hover:shadow-md': !focusOnSearchInput,
      }"
      :style="{
        height: searchSuggestionLoading ? '84px' : `${searchPanelHeight}px`,
      }"
    >
      <div
        class="relative flex items-center justify-center"
        @wheel.passive="handleWheel"
      >
        <button
          class="p-3 transition-colors rounded-full hover:bg-gray-200"
          @click.stop="showSearchProviderList = !showSearchProviderList"
          @contextmenu.prevent="showSearchProviderList = true"
        >
          <img :src="currentSearchProvider.icon" class="w-6 h-6">
        </button>
        <input
          ref="searchInputEle" v-model.trim="searchInputStr"
          class="outline-none px-1 flex-1 h-[48px]"
          type="text"
          :placeholder="`使用 ${currentSearchProvider.name} 搜索, 按下 / 聚焦到搜索框, 按下 Tab 切换搜索引擎`"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @input="handleInput"
          @keydown.up.prevent="handleChangeSuggestionIndex('up')"
          @keydown.down.prevent="handleChangeSuggestionIndex('down')"
          @keydown.enter="handleSearch"
          @keydown.tab.prevent="switchSearchProvider()"
        >
        <button class="p-3 transition-colors rounded-full hover:bg-gray-200" @click="handleSearch">
          <Search24Regular class="w-6 h-6 text-icon-btn " />
        </button>
      </div>
      <Transition name="popup-top">
        <div
          v-show="focusOnSearchInput && searchSuggestions.length > 0"
          class="w-full border-t z-40"
        >
          <Transition name="fade">
            <div v-show="searchSuggestionLoading" class="text-center w-full">
              loading
            </div>
          </Transition>
          <Transition name="fade">
            <div v-show="!searchSuggestionLoading">
              <button
                v-for="suggest, index in searchSuggestions" :key="suggest"
                class="w-full text-left px-4 py-1 text-sm hover:bg-gray-200 transition-all"
                :class="{
                  'bg-gray-200': index === searchSuggestionIndex,
                }"
                @click="searchInputStr = suggest; handleSearch()"
              >
                {{ suggest }}
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
    <Transition name="popup-top">
      <div
        v-if="showSearchProviderList"
        class="flex gap absolute left-0 top-[52px] border rounded-full bg-white shadow-sm z-50"
      >
        <button
          v-for="provider in Object.keys(SearchProviderMap)" :key="provider"
          class="p-3 transition-colors rounded-full"
          :class="{
            'bg-gray-300': provider === settings.searchProvider,
            'hover:bg-gray-200': provider !== settings.searchProvider,
          }"
          @click.stop="settings.searchProvider = provider"
        >
          <img :src="SearchProviderMap[provider].icon" :alt="SearchProviderMap[provider].name" class="w-6 h-6">
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useThrottleFn } from '@vueuse/core'
import { Search24Regular } from '@vicons/fluent'
import { SearchProviderMap, SuggestionProviderMap } from '@/constants'
import { getSearchSuggestion } from '@/api/search'
import { useStore } from '@/store'

const store = useStore()

const { settings } = toRefs(store)

const focusOnSearchInput = ref(false)
const showSearchProviderList = ref(false)
const searchInputEle = ref<HTMLInputElement | null>(null)
const searchInputStr = ref('')
const searchSuggestionStr = ref('')
const searchSuggestionLoading = ref(false)
const searchSuggestions = ref<string[]>([])
const searchSuggestionIndex = ref(-1)

const currentSearchProvider = computed(() => SearchProviderMap[settings.value.searchProvider])
const searchPanelHeight = computed(() => {
  return focusOnSearchInput.value ? searchSuggestions.value.length * 28 + 50 : 50
})

onMounted(() => {
  searchInputEle.value?.focus()
  document.addEventListener('click', () => {
    showSearchProviderList.value = false
  })
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === '/') {
      if (document.activeElement?.tagName === 'INPUT')
        return
      e.preventDefault()
      searchInputEle.value?.focus()
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

  const providers = Object.keys(SearchProviderMap)
  let currentIndex = providers.indexOf(settings.value.searchProvider)

  if (next)
    currentIndex++
  else
    currentIndex--

  if (currentIndex < 0)
    currentIndex = providers.length - 1

  else if (currentIndex >= providers.length)
    currentIndex = 0

  settings.value.searchProvider = providers[currentIndex]
  hideSearchProviderList()
}

function handleSearch() {
  const url = currentSearchProvider.value.url
    .replace('{keyword}', encodeURIComponent(searchInputStr.value))
  window.open(url)
  searchInputStr.value = ''
  searchSuggestionStr.value = ''
  searchSuggestions.value = []
}

const handleInput = useDebounceFn(() => {
  if (searchInputStr.value === '') {
    searchSuggestions.value = []
    return
  }

  searchSuggestionStr.value = searchInputStr.value
  searchSuggestionLoading.value = true

  const suggestionProvider = SuggestionProviderMap[settings.value.suggestionProvider]

  if (suggestionProvider.type === 'helper' && suggestionProvider.helper) {
    getSearchSuggestion(searchSuggestionStr.value, suggestionProvider.helper)
      .then(res => res.json())
      .then((data: any) => {
        if (data.code !== 0) {
          console.error(data)
          return
        }
        if (data.data.query === searchSuggestionStr.value) {
          searchSuggestions.value = data.data.response
          searchSuggestionIndex.value = -1
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        searchSuggestionLoading.value = false
      })
  }
}, 300)

const handleChangeSuggestionIndex = useThrottleFn((direction: 'up' | 'down') => {
  if (direction === 'up')
    searchSuggestionIndex.value--
  else
    searchSuggestionIndex.value++

  if (searchSuggestionIndex.value < -1)
    searchSuggestionIndex.value = searchSuggestions.value.length - 1

  else if (searchSuggestionIndex.value >= searchSuggestions.value.length)
    searchSuggestionIndex.value = 0

  if (searchSuggestionIndex.value === -1)
    searchInputStr.value = searchSuggestionStr.value
  else
    searchInputStr.value = searchSuggestions.value[searchSuggestionIndex.value]
}, 50, true, true)

function onInputFocus() {
  focusOnSearchInput.value = true
}

function onInputBlur() {
  searchSuggestionIndex.value = -1
  focusOnSearchInput.value = false
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
