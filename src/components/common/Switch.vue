<template>
  <button
    class="relative w-[40px] h-[20px] rounded-[20px] transition-colors duration-300 inline-block cursor-pointer"
    :class="{
      'bg-[#dcdfe6] dark:bg-[#4c4d4f]': !modelValue,
      'bg-[#409eff]': modelValue,
    }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div
      class="absolute w-[16px] h-[16px] bg-white top-[2px] left-[2px] rounded-full transition-transform duration-300"
      :class="{
        'translate-x-[20px]': modelValue,
      }"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()
defineEmits(['update:modelValue'])
</script>
