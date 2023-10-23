<template>
  <Transition name="modal-fade">
    <div
      v-if="modalShow"
      class="fixed left-0 top-0 w-screen h-screen bg-black/20 z-[999] flex items-center justify-center"
    >
      <div class="main bg-white rounded-md p-5 max-w-[400px] transition-all duration-300">
        <div class="text-xl font-bold">
          {{ modalData.title }}
        </div>
        <div class="my-2 max-h-[50vh] overflow-y-auto" v-html="modalData.content" />
        <input
          v-if="modalData.type === ModalType.INPUT" v-model="inputValue" type="text"
          class="w-full px-2 py-1 transition-colors border rounded-md outline-none" :class="{
            'border-red-400': !inputValid,
          }" @keydown.enter="handleConfirm"
        >
        <textarea
          v-if="modalData.type === ModalType.INPUT_MULTILINE" v-model="inputValue"
          class="w-[300px] min-h-[200px] border p-1 rounded-md outline-none resize-y transition-colors" :class="{
            'border-red-400': !inputValid,
          }"
        />
        <div v-if="modalData.type === ModalType.INPUT_JSON">
          <div v-for="item in customModalConfig" :key="item.key">
            <div class="mt-2 text-sm text-gray-500">
              {{ item.title }}
            </div>
            <input
              v-if="item.type === CustomModalType.TEXT" v-model="item.value" type="text"
              class="px-2 py-1 w-[300px] transition-colors border rounded-md outline-none"
            >
          </div>
        </div>
        <div class="mt-4">
          <button
            class="px-4 py-1 mr-2 text-white transition-colors bg-blue-500 border rounded-md hover:bg-blue-400"
            @click="handleConfirm"
          >
            确认
          </button>
          <button
            class="px-4 py-1 mr-2 transition-colors border rounded-md hover:bg-gray-200"
            @click="handleCancel"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import type { CustomModalProps } from '@/types/modal'
import { CustomModalType, ModalType } from '@/types/modal'

const store = useStore()

const { modal } = toRefs(store)

const modalShow = computed(() => modal.value.show)
const modalData = computed(() => modal.value.data)

const inputValue = ref('')
const customModalConfig = ref<CustomModalProps[]>([])

const inputValid = computed(() => {
  if (!modalData.value.validator)
    return true
  return modalData.value.validator(inputValue.value)
})

watch(modalShow, (val) => {
  if (val) {
    inputValue.value = modalData.value.defaultValue || ''
    if (modalData.value.type === ModalType.INPUT_JSON) {
      try {
        const config = JSON.parse(modalData.value.defaultValue || '')
        customModalConfig.value = config
      }
      catch {
        customModalConfig.value = []
      }
    }
  }
})

function handleConfirm() {
  if (!inputValid.value) {
    // store.toast.warning('输入不合法')
    return
  }
  if (modalData.value.type === ModalType.INPUT || modalData.value.type === ModalType.INPUT_MULTILINE) {
    modalData.value.onConfirm(inputValue.value)
  }
  else if (modalData.value.type === ModalType.INPUT_JSON) {
    const retData: any = {}
    for (const item of customModalConfig.value)
      retData[item.key] = item.value

    modalData.value.onConfirm(JSON.stringify(retData))
  }
  else {
    modalData.value.onConfirm()
  }
  handleCloseModal()
}

function handleCancel() {
  if (modalData.value.onCancel)
    modalData.value.onCancel()
  handleCloseModal()
}

function handleCloseModal() {
  store.closeModal()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all .3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  background-color: transparent;
}

.modal-fade-enter-from .main,
.modal-fade-leave-to .main {
  filter: blur(5px);
  opacity: 0;
  transform: scale(1.1);
}
</style>
