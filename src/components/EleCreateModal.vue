<template>
    <a-modal v-model:open="modalCreateIsVisible" title="我要收藏" wrapClassName="select-none" :maskClosable="false"
        :keyboard="false" :footer="null" :centered="true" okText="收藏" cancelText="取消">
        <a-spin :spinning="isSpinForForm" :tip="tipsForSpin">
            <a-form :label-col="{ style: { width: '100px' } }" ref="refCreateEle" :model="ele" :rules="rules"
                :colon="false">
                <a-form-item label="站点链接" name="link">
                    <a-input-search allow-clear v-model:value="ele.link" placeholder="请输入站点链接" @search="onClickToHack"
                        enter-button="HACK" />
                </a-form-item>
                <a-flex gap="12">
                    <a-form-item label="站点名称" name="title">
                        <a-input v-model:value="ele.title" placeholder="请输入名称" allow-clear />
                    </a-form-item>
                    <a-form-item label="排序" tooltip="控制站点显示顺序, 值越大, 越靠前" name="num_order">
                        <a-input v-model:value="ele.num_order" placeholder="请输入排序" allow-clear />
                    </a-form-item>
                </a-flex>
                <a-form-item label="站点标签" tooltip="站点标签, 又叫站点关键字, 以中文逗号间隔" name="keywords">
                    <a-select v-model:value="ele.keywords" mode="tags" notFoundContent="暂无标签, 请手动输入, 回车确认" />
                </a-form-item>
                <a-form-item label="站点简介" name="desc">
                    <a-textarea v-model:value="ele.desc" :rows="2" allow-clear :auto-size="{ minRows: 2, maxRows: 2 }"
                        placeholder="请输入站点简介" />
                </a-form-item>
                <a-form-item>
                    <div class="w-full flex items-center justify-center gap-2">
                        <a-button @click="onClickCancel">取消</a-button>
                        <a-button type="primary" @click="onClickSubmit">收藏</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script setup lang="ts">
import { getEleFromSourceCode, getErrorMessage } from '@/utils/util'
import { Rule } from 'ant-design-vue/es/form/interface'
import { MessageApi } from 'ant-design-vue/es/message'
import dayjs from 'dayjs'
import { Ele } from 'types/types'
import { getCurrentInstance, ref } from 'vue'

export interface RefEleCreateModal {
    onClickShowModal: () => void
}

const emits = defineEmits(["close"])

const message = getCurrentInstance()?.appContext.config.globalProperties.$message as MessageApi
const modalCreateIsVisible = ref<boolean>(false)

const refCreateEle = ref()
const ele = ref<Ele>({ link: "", num_order: 0 } as Ele)
const isSpinForForm = ref<boolean>(false)
const tipsForSpin = ref<string>("")
const rules: Record<string, Rule[]> = {
    link: [{ required: true, message: '请输入站点链接', trigger: 'blur' }],
    title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
};

const onClickToHack = (link: string) => {
    ele.value = { link: link, num_order: ele.value.num_order } as Ele
    if (!link) return
    try {
        const linkParsed = new URL(link)
        ele.value.link_origin = linkParsed.origin
    } catch (err: any) {
        message.error((err as Error).message)
    }

    isSpinForForm.value = true
    tipsForSpin.value = "HACK......"
    window.api.hackByUrl(link).then(souceCode => {
        const eleParsed = getEleFromSourceCode(ele.value.link_origin, souceCode)
        ele.value.title = eleParsed.title
        ele.value.desc = eleParsed.desc
        ele.value.link_logo = eleParsed.link_logo
        if (eleParsed.keywords) ele.value.keywords = eleParsed.keywords
    }).catch(err => {
        console.log(typeof err)
    }).finally(() => {
        isSpinForForm.value = false
        tipsForSpin.value = ""
    })
}

const onClickCancel = () => {
    modalCreateIsVisible.value = false
    refCreateEle.value.resetFields()
}

const onClickSubmit = () => {
    refCreateEle.value.validate().then(() => {
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
        ele.value.created_at = now
        ele.value.updated_at = now
        isSpinForForm.value = true
        window.api.eleCreate(JSON.stringify(ele.value)).then((result: boolean | Error) => {
            if (result === false || result instanceof Error) {
                const msg: string = result instanceof Error ? getErrorMessage(result) : "收藏失败, 请稍后重试"
                message.error(msg)
                return
            }
            message.success("收藏成功", 1.5, () => {
                onClickCancel()
                emits("close")
            })
        }).catch((err: Error) => {
            message.error(getErrorMessage(err))
        }).finally(() => isSpinForForm.value = false)
    }).catch((err: Error) => {
        err instanceof Error && message.error(err.message)
    })
}

const onClickShowModal = () => {
    modalCreateIsVisible.value = true
}

defineExpose({ onClickShowModal })
</script>