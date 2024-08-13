<template>
    <div @click="onClick" class="rounded-xl flex items-center justify-between gap-2 w-64 h-24 p-2 overflow-hidden text-slate-600 hover:text-primary hover:shadow-lg hover:shadow-primary/30 hover:border-transparent border border-solid border-primary/20 shadow-lg shadow-primary/10 cursor-pointer ">
        <div class="h-full w-12 flex items-center justify-center">
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
  ele: Ele
}>(), {})

const onClick = () => {
    window.api.openUrlWithDefaultBrowser(props.ele.link)
}
</script>