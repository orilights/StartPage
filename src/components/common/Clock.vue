<template>
  <div class="py-4">
    <div class="text-[60px] text-center">
      {{ time }}
    </div>
  </div>
</template>

<script setup lang="ts">
const time = ref('--:--')

onMounted(()=>{
  updateTime()
  setInterval(updateTime, 1000)
})

function updateTime() {
  const now = new Date()
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  time.value = `${hour}:${minute}`
}
</script>
