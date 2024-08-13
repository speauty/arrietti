<template>
  <a-dropdown :trigger="['contextmenu']">
    <div @click="onClickToOpenInBrower"
      class="rounded-xl flex items-center justify-between gap-2 w-64 h-24 p-2 overflow-hidden text-slate-600 hover:text-primary hover:shadow-lg hover:shadow-primary/30 hover:border-transparent border border-solid border-primary/20 shadow-lg shadow-primary/10 cursor-pointer ">
      <div class="h-full w-12 flex items-center justify-center">
        <a-image class="rounded" :preview="false" :width="48" :src="ele.link_logo" fallback="/public/logo.png"/>
      </div>
      <div class="h-full w-48 flex flex-col gap-1 overflow-hidden">
        <div class="w-full text-sm truncate">{{ ele.title }}</div>
        <div class="w-full text-xs line-clamp-2">{{ ele.desc }}</div>
        <div class="w-full text-xs truncate" v-if="ele.keywords?.length">{{ ele.keywords }}</div>
      </div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="delete" danger @click="onClickDelete">删除</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>

</template>
<script setup lang="ts">
import { getErrorMessage } from '@/utils/util';
import { MessageApi } from 'ant-design-vue/es/message'
import { Ele } from 'types/types'
import { getCurrentInstance } from 'vue'

const emits = defineEmits(["delete"])
const props = withDefaults(defineProps<{
  ele: Ele
}>(), {})
const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi

const onClickToOpenInBrower = () => {
  window.api.openUrlWithDefaultBrowser(props.ele.link)
}

const onClickDelete = () => {
  window.api.eleDelete(props.ele.id).then((result: boolean | Error) => {
    if (result instanceof Error) {
      message.error(getErrorMessage(result))
      return
    }
    message.success("删除成功", 1.5, () => {
      emits("delete", props.ele.id)
    })
  }).catch((err: Error) => {
    message.error(getErrorMessage(err))
  })
}
</script>