<template>
    <div class="w-full h-full">
        <div class="flex flex-wrap gap-3">
            <EleBlockUI v-for="ele in listEle" :ele="ele"/>
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
        <EleCreateModal ref="refEleCreateModal" />
    </div>

</template>

<script setup lang="ts">
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons-vue'
import EleBlockUI from '@/components/EleBlockUI.vue'
import EleCreateModal, { RefEleCreateModal } from '@/components/EleCreateModal.vue'
import { Ele } from 'types/types'
import { nextTick, ref } from 'vue'

const listEle = ref<Ele[]>([ 
    {
        id: 1, title: "Internet Speed Test - Measure Network Performance | Cloudflare", desc: "Test your Internet connection. Check your network performance with our Internet speed test. Powered by Cloudflare",
        link: "https://www.takara-tv.jp", link_logo: "https://www.cloudflare.com/favicon.ico",
        keywords: []
    },
    {
        id: 1, title: "少数派 - 高效工作，品质生活", desc: "少数派致力于更好地运用数字产品或科学方法，帮助用户提升工作效率和生活品质",
        link: "https://sspai.com", link_logo: "https://cdn-static.sspai.com/favicon/sspai.ico",
        keywords: ["app", "iOS", "Android", "sspai", "效率应用", "油猴", "软路由", "notion", "switch", "iPhone", "shortcuts", "VSCO", "手机摄影", "时间管理"]
    },
    {
        id: 1, title: "iLovePDF | 为PDF爱好者提供的PDF文件在线处理工具", desc: "iLovePDF网站提供PDF文件在线转换服务。它完全免费，而且使用方便。无论是合并PDF文件、拆分PDF文件、压缩PDF文件、Office文件转换为PDF文件，还是PDF转换为JPG图片等，iLovePDF都能满足您的需求！",
        link: "https://www.ilovepdf.com/zh-cn", link_logo: "https://www.ilovepdf.com/img/favicons-pdf/favicon-32x32.png",
        keywords: ["合并PDF文件", "拆分PDF文件", "合并PDF文件", "提取PDF文件", "压缩PDF文件", "转换PDF文件", "Word转换为PDF文件", "Excel转换为PDF文件", "Powerpoint转换为PDF文件", "PDF转换为JPG图片", "JPG转换为PDF文"]
    },
    {
        id: 1, title: "HandBrake: Open Source Video Transcoder", desc: "HandBrake is an open-source, GPL-licensed, multiplatform, multithreaded video transcoder.",
        link: "https://handbrake.fr/", link_logo: "https://handbrake.fr/img/logo.png",
        keywords: []
    },
] as Ele[])

const refEleCreateModal = ref<RefEleCreateModal|null>(null)

const onClickShowModal = () => {
    nextTick(() => refEleCreateModal.value?.onClickShowModal())
}

</script>