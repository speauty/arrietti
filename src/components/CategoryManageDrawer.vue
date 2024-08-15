<template>
    <a-drawer title="分类管理" rootClassName="drawer-category-manage" placement="right" v-model:open="isShow" :maskClosable="false" :closable="true"
        :get-container="false" :style="{ position: 'absolute' }" @close="close">
        <a-table size="small" bordered :columns="columns" :data-source="categories">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'operation'">
                  <div class="w-full flex items-center justify-center">
                    <a-button type="link" primary size="small" @click="onClickUpdate(record)">更新</a-button>
                    <a-button type="link" danger size="small" @click="onClickDelete(record.id)">删除</a-button>
                  </div>
                </template>
              </template>
        </a-table>
        <CategoryFormModal ref="refCategoryFormModal" @submit="listCategory" />
    </a-drawer>
</template>

<script setup lang="ts">
import { getErrorMessage } from '@/utils/util';
import { MessageApi } from 'ant-design-vue/es/message'
import { Category } from 'types/types'
import { getCurrentInstance, nextTick, ref } from 'vue'
import CategoryFormModal, { RefCategoryFormModal } from '@/components/CategoryFormModal.vue'
import {cloneDeep} from "lodash"

export interface RefCategoryManageDrawer {
    open: () => void
}

const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi
const isShow = ref<boolean>(false)
const columns = [
  { title: '名称', dataIndex: 'title', key: 'title', width: 80 },
  { title: '排序', dataIndex: 'num_order', key: 'num_order', align: 'center', width: 60 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', align: 'center', width: 120, ellipsis: true },
  { title: '操作', key: 'operation', align: 'center' },
]
const categories = ref<Category[]>([] as Category[])
const refCategoryFormModal = ref<RefCategoryFormModal|null>(null)

const onClickUpdate = (category: Category) => {
    nextTick(() => refCategoryFormModal.value?.open(cloneDeep(category)))
}

const onClickDelete = (categoryId: number) => {
    window.api.categoryDelete(categoryId).then((result: boolean | Error) => {
    if (result instanceof Error) {
      message.error(getErrorMessage(result))
      return
    }
    message.success("删除成功", 1.5, () => {
        listCategory()
    })
  }).catch((err: Error) => {
    message.error(getErrorMessage(err))
  })
}

const listCategory = () => {
    window.api.categoryList().then((result: string | Error) => {
        if (!result || result instanceof Error) {
            const msg: string = result instanceof Error ? getErrorMessage(result) : "获取分类失败, 请稍后重试"
            message.error(msg)
            return
        }
        categories.value = JSON.parse(result) as Category[]
    })
}

const close = () => {
    isShow.value = false
    categories.value = []
}

const open = () => {
    listCategory()
    isShow.value = true
}
defineExpose({open})
</script>