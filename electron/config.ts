import { BrowserWindow } from "electron/main"

const isMac = process.platform === 'darwin'

export const menus = (win: BrowserWindow): Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)> => {
    return [
        { label: "文件(F)(&F)", submenu: [
            {label: "退出(&Q)", role: isMac?'close':'quit'}
        ]},
        {label: "首选项(R)(&R)", submenu: [
            {label: "首页", click: () => sendRouteToRenderer(win, "home")},
            {label: "其他", click: () => sendRouteToRenderer(win, "other")},
        ]},
        {label: "帮助(H)(&H)", submenu: [
            {label: "刷新", role: "reload"},
            {label: "强制刷新", role: "forceReload"},
            {label: "调试面板", role: "toggleDevTools"}
        ]},
    ]
}

function sendRouteToRenderer(win: BrowserWindow, routeName: string) {
    win?.webContents.send('route-change', routeName)
  }
