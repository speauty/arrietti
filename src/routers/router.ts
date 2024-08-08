import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

import Index from "@/views/index/Index.vue"

const routes: RouteRecordRaw[] = [
    { path: "/", redirect: "index" },
    { name: "index", path: "/index", component: Index },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

export default router