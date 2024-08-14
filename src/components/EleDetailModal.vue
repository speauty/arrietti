<template>
    <a-modal v-model:open="modalDetailIsVisible" title="详情" :maskClosable="false"
        :keyboard="false" :footer="null" :cancel="onClickCloseModel">
        <a-descriptions :colon="false" :column="2">
            <a-descriptions-item :span="2" label="名称">{{ele.title}}</a-descriptions-item>
            <a-descriptions-item :span="2" label="简介" v-if="ele.desc">{{ele.desc}}</a-descriptions-item>
            <a-descriptions-item :span="2" label="关键词" v-if="ele.keywords?.length">
                <div class="w-full flex flex-wrap gap-1 items-center">
                    <a-tag v-for="(keyword, idx) in ele.keywords" :bordered="false" :color="tagColors[idx%14]">{{ keyword }}</a-tag>
                </div>
            </a-descriptions-item>
            <a-descriptions-item label="收藏时间">{{ele.created_at}}</a-descriptions-item>
            <a-descriptions-item label="排序">{{ ele.num_order }}</a-descriptions-item>
            <a-descriptions-item :span="2" label="域名">{{ ele.link_origin }}</a-descriptions-item>
            <a-descriptions-item :span="2" label="图标" v-if="ele.link_logo">
                <a-image class="rounded" :preview="false" :width="48" :src="ele.link_logo" fallback="/logo.png" />
            </a-descriptions-item>
          </a-descriptions>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Ele } from 'types/types'

export interface RefEleDetailModal {
    onClickShowModal: (paramEle: Ele) => void
}

const emits = defineEmits(["close"])
const tagColors: string[] = [
    'success', 'error', 'warning', 'magenta', 'red', 'volcano', 'orange', 'gold', 'lime',
    'green', 'cyan', 'blue', 'geekblue', 'purple'
]
const modalDetailIsVisible = ref<boolean>(false)
const ele = ref<Ele>({} as Ele)

const onClickShowModal = (paramEle: Ele) => {
    ele.value = paramEle
    modalDetailIsVisible.value = true
}

const onClickCloseModel = (_e: any) => {
    modalDetailIsVisible.value = false
    ele.value = {} as Ele
}

defineExpose({ onClickShowModal })
</script>
