<template>
  <Transition name="popup-settingpanel">
    <div
      v-if="showSettingPanel"
      class="p-4 border shadow-md rounded-lg bg-white min-w-[300px]"
    >
      <h2 class="font-bold text-lg">
        设置
      </h2>
      <div class="flex justify-between my-1">
        搜索引擎
        <select
          v-model="settings.searchProvider"
          class="border rounded px-2 py-0.5 hover:border-gray-400 focus:border-gray-400 transition-colors"
        >
          <option
            v-for="provider in Object.keys(SearchProviderMap)" :key="provider"
            :value="provider"
          >
            {{ SearchProviderMap[provider].name }}
          </option>
        </select>
      </div>
      <div class="flex justify-between my-1">
        搜索补全
        <select
          v-model="settings.suggestionProvider"
          class="border rounded px-2 py-0.5 hover:border-gray-400 focus:border-gray-400 transition-colors"
        >
          <option
            v-for="provider in Object.keys(SuggestionProviderMap)" :key="provider"
            :value="provider"
          >
            {{ SuggestionProviderMap[provider].name }}
          </option>
        </select>
      </div>
      <div class="flex justify-between my-1">
        Favicon API
        <select
          v-model="settings.faviconSource"
          class="border rounded px-2 py-0.5 hover:border-gray-400 focus:border-gray-400 transition-colors"
        >
          <option
            v-for="source in Object.keys(FaviconSourceMap)" :key="source"
            :value="source"
          >
            {{ FaviconSourceMap[source].name }}
          </option>
        </select>
      </div>
      <div class="flex justify-between items-center my-1">
        显示使用提示
        <Switch v-model="settings.showTips" />
      </div>
      <div class="flex gap-2 mt-2">
        <button
          class="border px-2 py-0.5 hover:bg-gray-200 rounded-md"
          @click="store.exportData"
        >
          导出备份
        </button>
        <button
          class="border px-2 py-0.5 hover:bg-gray-200 rounded-md"
          @click="store.importData"
        >
          导入备份
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { FaviconSourceMap, SearchProviderMap, SuggestionProviderMap } from '@/constants'

const store = useStore()

const { settings, showSettingPanel } = toRefs(store)

onMounted(() => {
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.option-area'))
      return
    showSettingPanel.value = false
  })
})
</script>

<style scoped>
.popup-settingpanel-enter-active,
.popup-settingpanel-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.popup-settingpanel-enter-from,
.popup-settingpanel-leave-to {
  opacity: 0;
  transform: translate(10px, -10px) scale(0.9);
}
</style>
