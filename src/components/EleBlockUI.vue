<template>
  <a-dropdown :trigger="['contextmenu']">
    <div @click="onClickToOpenInBrower"
      class="rounded-xl relative flex items-center justify-between gap-2 w-64 h-24 p-2 overflow-hidden text-slate-600 hover:text-primary hover:shadow-lg hover:shadow-primary/30 hover:border-transparent border border-solid border-primary/20 shadow-lg shadow-primary/10 cursor-pointer ">
      <div class="h-full w-12 flex items-center justify-center">
        <a-image class="rounded" :preview="false" :width="48" :src="ele.link_logo" fallback="/logo.png" />
      </div>
      <div class="h-full w-48 flex flex-col gap-1 overflow-hidden">
        <div class="w-full text-sm truncate">{{ ele.title }}</div>
        <div :class="ele.keywords?.length?'line-clamp-2':'line-clamp-3'" class="w-full text-xs">{{ ele.desc }}</div>
        <div class="w-full text-xs truncate" v-if="ele.keywords?.length">
          <a-tag v-for="(keyword, idx) in ele.keywords" :bordered="false" :color="tagColors[idx%14]">{{ keyword }}</a-tag>
        </div>
      </div>
      <div v-if="ele.category_title" class="absolute top-2 left-1 text-xs text-primary/70 w-14 truncate">{{ ele.category_title }}</div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="detail" @click="onClickShowDetailModal">详情</a-menu-item>
        <a-menu-item key="update" @click="onClickShowEleFormModal">更新</a-menu-item>
        <a-menu-item key="delete" @click="onClickDelete">删除</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <EleFormModal ref="refEleFormModal" @submit="onEmitSubmitForEleUpdate"/>
  <EleDetailModal ref="refEleDetailModal" />
</template>
<script setup lang="ts">
import { getErrorMessage } from '@/utils/util'
import { MessageApi } from 'ant-design-vue/es/message'
import { Ele } from 'types/types'
import { getCurrentInstance, nextTick, ref } from 'vue'
import EleFormModal, { RefEleFormModal } from './EleFormModal.vue'
import EleDetailModal, { RefEleDetailModal } from './EleDetailModal.vue'
import { cloneDeep } from 'lodash'

const emits = defineEmits(["delete", "update"])
const props = withDefaults(defineProps<{
  ele: Ele
}>(), {})
const tagColors: string[] = [
    'success', 'error', 'warning', 'magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'purple'
]
const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi
const refEleFormModal = ref<RefEleFormModal|null>(null)
const onClickShowEleFormModal = () => {
  nextTick(() => refEleFormModal.value?.open(cloneDeep(props.ele)))
}
const onEmitSubmitForEleUpdate = (ele: Ele) => emits("update", ele)
const refEleDetailModal = ref<RefEleDetailModal|null>(null)
const onClickShowDetailModal = () => {
  nextTick(() => refEleDetailModal.value?.onClickShowModal(cloneDeep(props.ele)))
}

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