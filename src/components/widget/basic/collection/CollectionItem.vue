<template>
  <div
    class="px-4 py-3 rounded-2xl border transition-colors group relative"
    @contextmenu="handleShowContextMenu"
  >
    <div class="absolute flex gap-2 top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="handleAddLink">
        <Add24Regular class="w-5 h-5 text-icon-btn" />
      </button>
      <ArrowBidirectionalUpDown12Regular class="w-5 h-5 text-icon-btn cursor-move handle" />
      <button @click="handleDelete">
        <Delete24Regular class="w-5 h-5 text-icon-btn" />
      </button>
    </div>
    <div>
      <span v-show="!editMode" @dblclick="enterEditMode">{{ data.name }}</span>
      <input
        v-show="editMode"
        ref="nameInput"
        v-model.trim="nameInputContent"
        type="text" maxlength="20"
        class="bg-transparent outline-none w-fit"
        @blur="exitEditMode"
        @keydown.enter="exitEditMode"
      >
    </div>
    <Draggable
      v-model="links"
      v-bind="dragOptions"
      :group="{ name: 'link' }"
      item-key="id"
      class="mt-2 flex gap-2 flex-wrap min-h-[1px]"
    >
      <template #item="{ element }">
        <LinkItem
          :parent-id="data.id"
          :data="element"
        />
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import Draggable from 'vuedraggable'
import { Add24Regular, ArrowBidirectionalUpDown12Regular, Delete24Regular } from '@vicons/fluent'
import { type CollectionData } from '@/types'
import { ContextMenuItemType, CustomModalType, ModalType } from '@/types'
import { useStore } from '@/store'

const props = defineProps<CollectionProps>()

const store = useStore()

const dragOptions = {
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}

interface CollectionProps {
  data: CollectionData
  index: number
}

const editMode = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)
const nameInputContent = ref('')

const links = computed({
  get() {
    return props.data.links
  },
  set(newVal) {
    store.updateCollection(props.data.id, { links: newVal })
  },
})

function enterEditMode() {
  editMode.value = true
  nameInputContent.value = props.data.name
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

function exitEditMode() {
  if (nameInputContent.value !== '')
    store.updateCollection(props.data.id, { name: nameInputContent.value })

  editMode.value = false
}

function handleDelete() {
  store.showModal({
    type: ModalType.CONFIRM,
    title: '删除集合',
    content: `确定要删除集合 ${props.data.name} 吗？<br/>集合内的链接将被全部删除？`,
    onConfirm: () => {
      store.deleteCollection(props.data.id)
    },
  })
}

function handleAddLink() {
  store.showModal({
    type: ModalType.INPUT_JSON,
    title: '添加链接',
    defaultValue: JSON.stringify([{
      title: '名称',
      key: 'name',
      type: CustomModalType.TEXT,
      value: '新链接',
    }, {
      title: '链接',
      key: 'target',
      type: CustomModalType.TEXT,
      value: 'https://example.com',
    }]),
    onConfirm: (inputValue?: string) => {
      if (!inputValue)
        return
      const newData = JSON.parse(inputValue)
      store.addLink(props.data.id, newData)
    },
  })
}

function handleShowContextMenu(e: MouseEvent) {
  e.preventDefault()
  store.showContextMenu({
    items: [{
      type: ContextMenuItemType.Button,
      text: '添加链接',
      callback: handleAddLink,
    },
    {
      type: ContextMenuItemType.Separator,
    },
    {
      type: ContextMenuItemType.Button,
      text: '编辑名称',
      callback: enterEditMode,
    },
    {
      type: ContextMenuItemType.Button,
      text: '删除集合',
      callback: handleDelete,
    },
    {
      type: ContextMenuItemType.Separator,
    },
    {
      type: ContextMenuItemType.Button,
      text: '在上方新建集合',
      callback: () => store.addCollection(props.index),
    },
    {
      type: ContextMenuItemType.Button,
      text: '在下方新建集合',
      callback: () => store.addCollection(props.index + 1),
    },
    {
      type: ContextMenuItemType.Separator,
    },
    {
      type: ContextMenuItemType.Text,
      text: props.data.name,
      textSize: 12,
      textColor: '#888888',
    }],
    pos: {
      x: e.clientX,
      y: e.clientY,
    },
  })
}
</script>

<style>
.ghost {
  opacity: 0.3;
}
</style>
