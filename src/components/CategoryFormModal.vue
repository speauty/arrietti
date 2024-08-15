<template>
    <a-modal v-model:open="modalIsVisible" :title="category.id?'我要更新':'我要分类'" :maskClosable="false"
        :keyboard="false" :footer="null" :centered="true" :width="360">
        <a-spin :spinning="isSpinForForm" :tip="tipsForSpin">
            <a-form :label-col="{ style: { width: '60px' } }" ref="refFormCategory" :model="category" :rules="rules"
                :colon="false">
                <a-form-item label="名称" name="title">
                    <a-input v-model:value="category.title" placeholder="请输入名称" allow-clear :maxlength="4"/>
                </a-form-item>
                <a-form-item label="排序" tooltip="值越大, 越靠前" name="num_order">
                    <a-input v-model:value="category.num_order" placeholder="请输入排序"/>
                </a-form-item>
                <a-form-item>
                    <div class="w-full flex items-center justify-center gap-2">
                        <a-button @click="onClickCancel">取消</a-button>
                        <a-button type="primary" @click="onClickSubmit">{{category.id?'更新':'保存'}}</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script setup lang="ts">
import { getErrorMessage } from '@/utils/util'
import { Rule } from 'ant-design-vue/es/form/interface'
import { MessageApi } from 'ant-design-vue/es/message'
import dayjs from 'dayjs'
import {clone} from "lodash"
import { Category } from 'types/types'
import { getCurrentInstance, ref } from 'vue'

export interface RefCategoryFormModal {
    onClickShowModal: (paramEle: Category|null) => void
}

const emits = defineEmits(["submit"])

const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi
const modalIsVisible = ref<boolean>(false)

const refFormCategory = ref()
const category = ref<Category>({num_order: 0} as Category)
const isSpinForForm = ref<boolean>(false)
const tipsForSpin = ref<string>("")
const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
};

const onClickCancel = () => {
    modalIsVisible.value = false
    refFormCategory.value.resetFields()
}

const onClickSubmit = () => {
    refFormCategory.value.validate().then(() => {
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
        if (!category.value.id) {
            category.value.created_at = now
        }
        category.value.updated_at = now
        isSpinForForm.value = true
        if (category.value.id) {
            window.api.categoryUpdate(JSON.stringify(category.value)).then((result: boolean | Error) => {
            if (result === false || result instanceof Error) {
                const msg: string = result instanceof Error ? getErrorMessage(result) : "更新分类失败, 请稍后重试"
                message.error(msg)
                return
            }
            message.success("更新分类成功", 1.5, () => {
                emits("submit", clone(category.value))
                onClickCancel()
            })
        }).catch((err: Error) => message.error(getErrorMessage(err))).finally(() => isSpinForForm.value = false)
        } else {
            window.api.categoryCreate(JSON.stringify(category.value)).then((result: number | Error) => {
            if (!result || result instanceof Error) {
                const msg: string = result instanceof Error ? getErrorMessage(result) : "创建分类失败, 请稍后重试"
                message.error(msg)
                return
            }
            let categoryCloned: Category = clone(category.value)
            categoryCloned.id = result
            message.success("创建分类成功", 1.5, () => {
                emits("submit", categoryCloned)
                onClickCancel()
            })
        }).catch((err: Error) => message.error(getErrorMessage(err))).finally(() => isSpinForForm.value = false)
        }
    }).catch((err: Error) => {
        err instanceof Error && message.error(err.message)
    })
}

const onClickShowModal = (paramCategory: Category|null) => {
    paramCategory && (category.value = paramCategory)
    modalIsVisible.value = true
}

defineExpose({ onClickShowModal })
</script>