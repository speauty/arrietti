<template>
    <div @click="onClick" class="rounded-xl flex items-center justify-between gap-2 w-64 h-24 p-2 overflow-hidden text-slate-600 hover:text-primary hover:shadow-lg hover:shadow-primary/20 shadow-inner shadow-primary/50 cursor-pointer ">
        <div class="h-full w-12 border border-indigo-600 flex items-center justify-center">
            <a-image class="rounded" :preview="false" :width="48" :src="ele.link_logo" />
        </div>
        <div class="h-full w-48 flex flex-col gap-1 overflow-hidden">
            <div class="w-full text-sm truncate">{{ ele.title}}</div>
            <div class="w-full text-xs line-clamp-2">{{ ele.desc}}</div>
            <div class="w-full text-xs truncate" v-if="ele.keywords?.length">{{ ele.keywords}}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Ele } from 'types/types'

const props = withDefaults(defineProps<{
  ele?: Ele
}>(), {
  ele: (): Ele => {
    return {
        id: 0, title: "百度一下，你就知道", desc: "全球领先的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。百度超过千亿的中文网页数据库，可以瞬间找到相关的搜索结果。", 
        link: "https://www.baidu.com", link_logo: "https://www.baidu.com/favicon.ico",
        num_order: 12, is_accessible: true,
        created_at: "", updated_at: ""
    } as Ele
  }
})

const onClick = () => {
    window.api.openUrlWithDefaultBrowser(props.ele.link)
}
</script>