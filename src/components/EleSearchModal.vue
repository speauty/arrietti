<template>
    <a-modal v-model:open="isShow" title="搜索" :maskClosable="false" :keyboard="false"
        :footer="null" :centered="true">
            <a-form :label-col="{ style: { width: '100px' } }" ref="refFormEle" :model="ele" :colon="false">
                <a-form-item label="站点链接" name="link">
                    <a-input v-model:value="ele.link" placeholder="请输入站点链接" allow-clear />
                </a-form-item>
                <a-flex gap="12">
                    <a-form-item label="站点名称" name="title">
                        <a-input v-model:value="ele.title" placeholder="请输入名称" allow-clear />
                    </a-form-item>
                    <a-form-item label="站点简介" name="desc">
                        <a-input v-model:value="ele.desc" placeholder="请输入简介" allow-clear  />
                    </a-form-item>
                </a-flex>
                <a-form-item label="所属分类" name="category_id">
                    <a-select v-model:value="ele.category_id" :options="categories" :field-names="{ label: 'title', value: 'id' }">
                    </a-select>
                </a-form-item>
                
                <a-form-item class="mb-0">
                    <div class="w-full flex items-center justify-center gap-2">
                        <a-button @click="onClickReset">重置</a-button>
                        <a-button type="primary" @click="onClickSearch">检索</a-button>
                    </div>
                </a-form-item>
            </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { getErrorMessage } from '@/utils/util'
import { MessageApi } from 'ant-design-vue/es/message'
import { Category, Ele } from 'types/types'
import { getCurrentInstance, ref } from 'vue'
export interface RefEleSearchModal {
    open: (paramEle: Ele) => void
}
const emits = defineEmits(["search"])

const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi
const isShow = ref<boolean>(false)

const refFormEle = ref()
const ele = ref<Ele>({} as Ele)
const categories = ref<Category[]>([] as Category[])

const onClickReset = () => {
    isShow.value = false
    refFormEle.value.resetFields()
    emits("search", {})
}

const onClickSearch = () => {
    isShow.value = false
    emits("search", ele.value)
}

const open = (paramEle: Ele) => {
    window.api.categoryList().then((result: string | Error) => {
        if (!result || result instanceof Error) {
            const msg: string = result instanceof Error ? getErrorMessage(result) : "获取分类失败, 请稍后重试"
            message.error(msg)
            return
        }
        categories.value = JSON.parse(result) as Category[]
    })
    paramEle && (ele.value = paramEle)
    isShow.value = true
}

defineExpose({ open })
</script>