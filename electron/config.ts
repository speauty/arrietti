import { BrowserWindow, dialog, app, shell } from "electron"

const isMac = process.platform === 'darwin'

export const menus = (win: BrowserWindow): Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)> => {
     
    return app.isPackaged?[
        {
            label: "文件(F)(&F)", submenu: [
                { label: "退出(&Q)", role: isMac ? 'close' : 'quit' }
            ]
        },
        {
            label: "帮助(H)(&H)", submenu: [
                { label: "刷新", role: "forceReload" },
                { label: "反馈", click: () => shell.openExternal("https://github.com/speauty/arrietti/issues/new") },
                { label: "关于", click: () => dialogForAbout(win) },
            ]
        },
    ]:[
        {
            label: "文件(F)(&F)", submenu: [
                { label: "退出(&Q)", role: isMac ? 'close' : 'quit' }
            ]
        },
        {
            label: "帮助(H)(&H)", submenu: [
                { label: "刷新", role: "reload" },
                { label: "强制刷新", role: "forceReload" },
                { label: "调试面板", role: "toggleDevTools" },
                { label: "反馈", click: () => shell.openExternal("https://github.com/speauty/arrietti/issues/new") },
                { label: "关于", click: () => dialogForAbout(win) },
            ]
        },
    ]
}

// function sendRouteToRenderer(win: BrowserWindow, routeName: string) {
//     win?.webContents.send('route-change', routeName)
// }

const dialogForAbout = (win: BrowserWindow) => {
    dialog.showMessageBox(win, {
        type: 'info',
        title: process.env.VITE_APP_NAME?process.env.VITE_APP_NAME:"阿莉埃蒂",
        message: process.env.VITE_APP_NAME?process.env.VITE_APP_NAME:"阿莉埃蒂",
// 提交: e170252f762678dec6ca2cc69aba1570769a5d39
// 日期: 2024-04-10T17:41:02.734Z
        detail: `版本: ${process.env.npm_package_version}
Electron: ${process.versions.electron}
ElectronBuildId: ${process.env.ELECTRON_DIST_URL}
Chromium: ${process.versions.chrome}
Node.js: ${process.versions.node}
V8: ${process.versions.v8}
OS: ${process.platform} ${process.arch} ${process.getSystemVersion() }
`
    })
}
