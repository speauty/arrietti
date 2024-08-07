<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#6db64c',
    },
  }">
    <div class="w-screen h-screen p-2 select-none">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  window.ipcRenderer.on('route-change', (_event, routeName: string) => router.push(routeName))
}) 
</script>