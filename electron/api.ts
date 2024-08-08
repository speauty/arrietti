/** 接口-网路请求 */
import { ipcMain, IpcMainInvokeEvent, ipcRenderer, shell, net } from 'electron'


export const registerApis = () => {
    ipcMain.on('api:openUrlWithDefaultBrowser', openUrlWithDefaultBrowser)
    ipcMain.handle('api:hackByUrl', hackByUrl)
}

export const exposeApis = () => {
    return {
        openUrlWithDefaultBrowser: (url: string) => ipcRenderer.send('api:openUrlWithDefaultBrowser', url),
        hackByUrl: (url: string) => ipcRenderer.invoke('api:hackByUrl', url),
    }
}

export const openUrlWithDefaultBrowser = (_event: IpcMainInvokeEvent, url: string): void => {
    shell.openExternal(url)
    return ;
}

export const hackByUrl = async (_event: IpcMainInvokeEvent, url: string): Promise<any> => {
    const result = await net.fetch(url)
    return result.text()
}