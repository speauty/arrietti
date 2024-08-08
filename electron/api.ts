/** 接口-网路请求 */
import { ipcMain, IpcMainInvokeEvent, ipcRenderer, shell } from 'electron'


export const registerApis = () => {
    ipcMain.on('api:openUrlWithDefaultBrowser', openUrlWithDefaultBrowser)
}

export const exposeApis = () => {
    return {
        openUrlWithDefaultBrowser: (url: string) => ipcRenderer.send('api:openUrlWithDefaultBrowser', url),
    }
}

export const openUrlWithDefaultBrowser = (_event: IpcMainInvokeEvent, url: string): void => {
    shell.openExternal(url)
    return ;
}