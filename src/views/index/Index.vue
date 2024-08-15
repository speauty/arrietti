<template>
    <div ref="context" class="w-full h-full custom-overflow-y">
        <div v-if="listEle?.length" class="flex flex-wrap gap-3">
                <EleBlockUI v-for="ele in listEle" :ele="ele" @update="onEmitUpdateForEle" @delete="onEmitDeleteForEle" />
        </div>
        <div v-else class="w-full h-full flex items-center justify-center ">
            <a-empty image="/logo.png">
                <template #description>
                    <span class="text-xs text-slate-500">暂无收藏站点，请点击“我要收藏”进行创建</span>
                </template>
                <a-button class="hover:animate-bounce" type="primary" @click="onClickShowEleFormModal">我要收藏</a-button>
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
            <a-float-button type="primary" tooltip="我要收藏" @click="onClickShowEleFormModal">
                <template #icon>
                    <GlobalOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
        <EleFormModal ref="refEleFormModal" @submit="onEmitSubmitForEleCreate" />
    </div>
</template>

<script setup lang="ts">
import { AppstoreOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import EleBlockUI from '@/components/EleBlockUI.vue'
import EleFormModal, { RefEleFormModal } from '@/components/EleFormModal.vue'
import { Ele, Page } from 'types/types'
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { MessageApi } from 'ant-design-vue/es/message'
import { getErrorMessage } from '@/utils/util'
import { throttle } from "lodash"

const context = ref()
const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi
const listEle = ref<Ele[]>([] as Ele[])
const page = ref<Page>({ page: 1, page_size: 100 } as Page)
const hasMore = ref<boolean>(true)
const refEleFormModal = ref<RefEleFormModal | null>(null)

const queryEleList = () => {
    if (!hasMore.value) {
        message.warn("暂无更多收藏")
        return
    }
    window.api.eleList(JSON.stringify(page.value)).then((result: Error | string) => {
        if (result instanceof Error) {
            message.error(getErrorMessage(result))
            return
        }
        const eles = JSON.parse(result) as Ele[]
        if (eles.length) {
            listEle.value.push(...eles)
            page.value.page++
            hasMore.value = eles.length >= page.value.page_size
        } else {
            hasMore.value = false
        }
    }).catch((err: Error) => {
        message.error(getErrorMessage(err))
    })
}

const onEmitSubmitForEleCreate = (ele: Ele) => {
    listEle.value = [ele].concat(...listEle.value)
}

const onEmitDeleteForEle = (eleId: number) => {
    listEle.value = listEle.value.filter((ele: Ele) => ele.id !== eleId)
}
const onEmitUpdateForEle = (ele: Ele) => {
    for (let idx = 0; idx < listEle.value.length; idx++) {
        if (listEle.value[idx].id === ele.id) {
            listEle.value[idx] = ele
            break
        }
    }
}

const onClickShowEleFormModal = () => {
    nextTick(() => refEleFormModal.value?.onClickShowModal(null))
}

const onEventScroll = (event: any) => { // @todo 存在问题
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
        queryEleList()
    }
}

onMounted(() => {
    context.value?.addEventListener("scroll", throttle(onEventScroll, 1e3))
    queryEleList()
})

onUnmounted(() => {
    context.value?.removeEventListener('scroll', onEventScroll)
})

</script>