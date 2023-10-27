<template>
  <Draggable
    v-model="collections"
    v-bind="dragOptions"
    :group="{ name: 'collection' }"
    item-key="id"
    handle=".handle"
  >
    <template #item="{ element, index }">
      <CollectionItem
        :data="element"
        :index="index"
        class="my-2"
      />
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import { useStore } from '@/store'

const store = useStore()

const dragOptions = {
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}

const { collections } = toRefs(store)
</script>
