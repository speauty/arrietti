import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

import Home from "@/views/Home.vue"
import Other from "@/views/Other.vue"

const routes: RouteRecordRaw[] = [
    { path: "/", redirect: "home" },
    { name: "home", path: "/home", component: Home },
    { name: "other", path: "/other", component: Other },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

export default router