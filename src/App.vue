<template>
  <div class="w-full px-6 max-w-[1200px] xl:mx-auto">
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

    <ContextMenu />
    <Teleport to="body">
      <Modal />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import settings, { SettingType } from './utils/settings'
import { useStore } from '@/store'

const store = useStore()

const { collections } = toRefs(store)

onMounted(() => {
  settings.register('collections', collections, SettingType.Json)
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
