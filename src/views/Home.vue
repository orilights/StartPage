<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <HelloWorld />
    <button
      class="px-2 py-1 border rounded-md hover:border-blue-500"
      @click="count++"
    >
      Count: {{ count }}
    </button>
  </div>
</template>

<script setup lang="ts">
const count = ref(1)
</script>
