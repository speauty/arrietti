<template>
    <div
        class="w-full h-full overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-primary/80 scrollbar-track-primary/20">
        <div v-if="listEle?.length" class="flex flex-wrap gap-3">
            <EleBlockUI v-for="ele in listEle" :ele="ele" @delete="onEmitDeleteForEle" />
        </div>
        <div v-else class="w-full h-full flex items-center justify-center">
            <a-empty image="/logo.png" >
                <template #description>
                    <span class="text-xs text-slate-500">暂无收藏站点，请点击“我要收藏”进行创建</span>
                </template>
                <a-button type="primary" @click="onClickShowModal">我要收藏</a-button>
            </a-empty>
        </div>
        <a-float-button-group trigger="hover" type="primary" tooltip="快捷导航" :style="{ bottom: '24px', right: '24px' }">
            <template #icon>
                <AppstoreOutlined />
            </template>
            <a-float-button type="primary" tooltip="我要收藏" @click="onClickShowModal">
                <template #icon>
                    <PlusOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
        <EleCreateModal ref="refEleCreateModal" @close="onEmitCloseForEleCreate" />
    </div>

</template>

<script setup lang="ts">
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons-vue'
import EleBlockUI from '@/components/EleBlockUI.vue'
import EleCreateModal, { RefEleCreateModal } from '@/components/EleCreateModal.vue'
import { Ele } from 'types/types'
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import { MessageApi } from 'ant-design-vue/es/message'
import { getErrorMessage } from '@/utils/util'

const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi

const listEle = ref<Ele[]>([] as Ele[])

const refEleCreateModal = ref<RefEleCreateModal | null>(null)

const queryEleList = () => {
    listEle.value = []
    window.api.eleList().then((result: Error | string) => {
        if (result instanceof Error) {
            message.error(getErrorMessage(result))
            return
        }
        listEle.value = JSON.parse(result) as Ele[]
    }).catch((err: Error) => {
        message.error(getErrorMessage(err))
    })
}

const onEmitCloseForEleCreate = queryEleList

const onEmitDeleteForEle = (_eleId: number) => {
    queryEleList()
}

const onClickShowModal = () => {
    nextTick(() => refEleCreateModal.value?.onClickShowModal())
}

onMounted(() => {
    queryEleList()
})

</script>