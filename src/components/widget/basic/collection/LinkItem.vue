<template>
  <a
    :href="data.target"
    class="px-2 py-1 border hover:bg-gray-200 transition-colors rounded-lg inline-flex items-center gap-1.5
    shadow-sm hover:shadow-none"
    target="_blank" rel="noreferrer"
    @contextmenu="handleShowContextMenu"
  >
    <img
      :src="favicon" alt="website icon"
      class="w-5 h-5 rounded-sm"
    >
    {{ data.name }}
  </a>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { type LinkData } from '@/types'
import { ContextMenuItemType, CustomModalType, ModalType } from '@/types'

import { FaviconSourceMap } from '@/constants'

const props = defineProps<{
  parentId: string
  data: LinkData
}>()

const store = useStore()

const { settings } = toRefs(store)

const favicon = computed(() => {
  try {
    const url = new URL(props.data.target)
    return FaviconSourceMap[settings.value.faviconSource].url.replace('{hostname}', url.hostname)
  }
  catch {
    return ''
  }
})

function handleCopyLink() {
  navigator.clipboard.writeText(props.data.target)
}

function handleCopyLinkText() {
  navigator.clipboard.writeText(props.data.name)
}

function handleEdit() {
  store.showModal({
    type: ModalType.INPUT_JSON,
    title: '编辑链接',
    defaultValue: JSON.stringify([{
      title: '名称',
      key: 'name',
      type: CustomModalType.TEXT,
      value: props.data.name,
    }, {
      title: '链接',
      key: 'target',
      type: CustomModalType.TEXT,
      value: props.data.target,
    }]),
    onConfirm: (inputValue?: string) => {
      if (!inputValue)
        return
      const newData = JSON.parse(inputValue)
      store.updateLink(props.parentId, props.data.id, newData)
    },
  })
}

function handleDelete() {
  store.deleteLink(props.parentId, props.data.id)
}

function handleShowContextMenu(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  store.showContextMenu({
    items: [{
      type: ContextMenuItemType.Button,
      text: '在新标签页打开',
      callback: () => window.open(props.data.target, '_blank', 'noreferrer'),
    },
    {
      type: ContextMenuItemType.Button,
      text: '在当前标签页打开',
      callback: () => window.open(props.data.target, '_self', 'noreferrer'),
    },
    {
      type: ContextMenuItemType.Separator,
    },
    {
      type: ContextMenuItemType.Button,
      text: '复制链接地址',
      callback: handleCopyLink,
    },
    {
      type: ContextMenuItemType.Button,
      text: '复制链接文本',
      callback: handleCopyLinkText,
    },
    {
      type: ContextMenuItemType.Separator,
    },
    {
      type: ContextMenuItemType.Button,
      text: '编辑',
      callback: handleEdit,
    },
    {
      type: ContextMenuItemType.Button,
      text: '删除',
      callback: handleDelete,
    },
    {
      type: ContextMenuItemType.Separator,
    },
    {
      type: ContextMenuItemType.Text,
      text: `link ${props.data.name}`,
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
