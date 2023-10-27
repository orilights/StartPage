<template>
  <div class="w-full px-6 max-w-[1200px] xl:mx-auto relative">
    <div class="absolute right-6 top-6 z-50 option-area">
      <div class="flex justify-end">
        <button @click="store.toggleSettingPanel">
          <Settings24Regular class="w-6 h-6 text-icon-btn" />
        </button>
      </div>
      <SettingPanel class="mt-2" />
    </div>
    <Clock />
    <SearchPanel class="mx-auto mb-6" />
    <CollectionList />
    <details>
      <summary>debug</summary>
      <div class="flex gap-2">
        <button class="rounded-md border px-2 py-0.5" @click="handleAddCollection">
          add collection
        </button>
        <button class="rounded-md border px-2 py-0.5" @click="collections = []">
          clear data
        </button>
      </div>
      <pre>{{ JSON.stringify(store.collections, null, 2) }}</pre>
    </details>

    <Teleport to="body">
      <ContextMenu />
      <Modal />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Settings24Regular } from '@vicons/fluent'
import { useStore } from '@/store'

const store = useStore()

const { collections } = toRefs(store)

function handleAddCollection() {
  store.addCollection({
    id: '',
    name: 'New Collection',
    description: 'This is a description',
    links: [],
  })
}
</script>

<style>
  body {
    overflow-x: hidden;
  }
</style>
