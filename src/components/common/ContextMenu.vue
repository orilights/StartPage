<template>
  <Transition name="popup-contextmenu">
    <div
      v-if="contextMenuShow"
      ref="ele"
      class="context-menu absolute rounded-lg overflow-hidden shadow-lg bg-white border min-w-[100px] max-w-[300px]"
      :style="{
        left: `${contextMenuData.pos.x}px`,
        top: `${contextMenuData.pos.y}px`,
      }"
    >
      <div v-for="item, index in contextMenuData.items" :key="index">
        <template v-if="item.type === ContextMenuItemType.Button">
          <button
            class="w-full px-4 py-1.5 bg-white hover:bg-gray-200 transition-colors text-left"
            @click="handleClickItem(item.callback as () => void)"
          >
            {{ item.text }}
          </button>
        </template>
        <template v-else-if="item.type === ContextMenuItemType.Separator">
          <div class="w-full h-[1px] bg-gray-200" />
        </template>
        <template v-else-if="item.type === ContextMenuItemType.Text">
          <div
            class="px-4 py-1.5 bg-white"
            :style="{
              color: item.textColor,
              fontSize: `${item.textSize}px`,
            }"
          >
            {{ item.text }}
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { ContextMenuItemType } from '@/types'

const store = useStore()

const { contextMenu } = toRefs(store)

const contextMenuShow = computed(() => contextMenu.value.show)
const contextMenuData = computed(() => contextMenu.value.data)

const ele = ref<HTMLElement | null>(null)

watch(contextMenuShow, (val) => {
  if (val) {
    fixPosition()
    registerEvent()
  }
})

async function fixPosition() {
  await nextTick()
  if (!ele.value)
    return
  const rect = ele.value.getBoundingClientRect()
  const { innerWidth, innerHeight } = window
  if (rect.right > innerWidth)
    contextMenuData.value.pos.x = innerWidth - rect.width
  if (rect.bottom > innerHeight)
    contextMenuData.value.pos.y = innerHeight - rect.height
}

function registerEvent() {
  document.addEventListener('click', handleClick)
  window.addEventListener('resize', handleResize)
}

function unregisterEvent() {
  document.removeEventListener('click', handleClick)
  window.removeEventListener('resize', handleResize)
}

function handleClick(e: MouseEvent) {
  if (e.target instanceof HTMLElement) {
    if (e.target.closest('.context-menu'))
      return
  }
  store.closeContextMenu()
  unregisterEvent()
}

function handleResize() {
  store.closeContextMenu()
  unregisterEvent()
}

function handleClickItem(callback: () => void) {
  callback()
  store.closeContextMenu()
}
</script>

<style>
.popup-contextmenu-enter-active,
.popup-contextmenu-leave-active {
  transition: all 0.3s;
}

.popup-contextmenu-enter-from{
  opacity: 0;
  transform: translateY(-10px);
}

.popup-contextmenu-leave-to {
  opacity: 0;
}
</style>
