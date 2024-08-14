<template>
    <div class="w-full h-full">
        <div v-if="listEle?.length" class="flex flex-wrap gap-3">
            <EleBlockUI v-for="ele in listEle" :ele="ele" @delete="onEmitDeleteForEle" />
        </div>
        <div v-else class="w-full h-full flex items-center justify-center ">
            <a-empty image="/logo.png" >
                <template #description>
                    <span class="text-xs text-slate-500">暂无收藏站点，请点击“我要收藏”进行创建</span>
                </template>
                <a-button class="hover:animate-bounce" type="primary" @click="onClickShowCreateModal">我要收藏</a-button>
            </a-empty>
        </div>
        <a-float-button-group trigger="click" type="primary" tooltip="快捷导航" :style="{ bottom: '24px', right: '24px' }">
            <template #icon>
                <AppstoreOutlined />
            </template>
            <!-- <a-float-button type="primary" tooltip="我要分类" @click="onClickShowCreateModal">
                <template #icon>
                    <FolderOpenOutlined />
                </template>
            </a-float-button> -->
            <a-float-button type="primary" tooltip="我要收藏" @click="onClickShowCreateModal">
                <template #icon>
                    <GlobalOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
        <EleCreateModal ref="refEleCreateModal" @submit="onEmitSubmitForEleCreate" />
    </div>

</template>

<script setup lang="ts">
import { AppstoreOutlined, GlobalOutlined } from '@ant-design/icons-vue'
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

const onEmitSubmitForEleCreate = (ele: Ele) => {
    console.log(ele)
    listEle.value = [ele].concat(...listEle.value)
}

const onEmitDeleteForEle = (eleId: number) => {
    listEle.value = listEle.value.filter((ele: Ele) => ele.id !== eleId)
}

const onClickShowCreateModal = () => {
    nextTick(() => refEleCreateModal.value?.onClickShowModal())
}

onMounted(() => {
    queryEleList()
})

</script>