import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

import Home from "@/views/Home.vue"

const routes: RouteRecordRaw[] = [
    { path: "/", redirect: "home" },
    { name: "home", path: "/home", component: Home }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

export default router