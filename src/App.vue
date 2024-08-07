<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#6db64c',
    },
  }">
    <div class="w-screen h-screen">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>
