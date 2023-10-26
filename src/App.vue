<template>
  <div class="w-full px-6 max-w-[1200px] xl:mx-auto relative">
    <div class="absolute right-6 top-6 z-50 option-area">
      <div class="flex justify-end">
        <button @click="store.toggleSettingPanel">
          <Settings24Regular class="w-6 h-6" />
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
        <button class="rounded-md border px-2 py-0.5" @click="handleAddLink">
          add link
        </button>
        <button class="rounded-md border px-2 py-0.5" @click="store.exportData">
          export data
        </button>
        <button class="rounded-md border px-2 py-0.5" @click="store.importData">
          import data
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
import settings, { SettingType } from './utils/settings'
import { useStore } from '@/store'

const store = useStore()

const { collections, settings: set } = toRefs(store)

onMounted(() => {
  settings.register('collections', collections, SettingType.Json)
  settings.register('settings', set, SettingType.Json)
})

function handleAddCollection() {
  store.addCollection({
    id: '',
    name: 'New Collection',
    description: 'This is a description',
    links: [],
  })
}

function handleAddLink() {
  const collectionId = store.collections[0].id
  if (!collectionId)
    return
  store.addLink(collectionId, {
    id: '',
    name: 'Google',
    target: 'https://www.google.com',
  })
}
</script>
