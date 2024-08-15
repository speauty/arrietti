import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('api',{
  openUrlWithDefaultBrowser: (url: string) => ipcRenderer.send('api:openUrlWithDefaultBrowser', url),
  hackByUrl: (url: string) => ipcRenderer.invoke('api:hackByUrl', url),
  eleCreate: (rawEle: string) => ipcRenderer.invoke("api:eleCreate", rawEle),
  eleList: (rawPage: string, rawEle: string) => ipcRenderer.invoke("api:eleList", rawPage, rawEle),
  eleUpdate: (rawEle: string) => ipcRenderer.invoke("api:eleUpdate", rawEle),
  eleDelete: (eleId: number) => ipcRenderer.invoke("api:eleDelete", eleId),

  categoryCreate: (rawCategory: string) => ipcRenderer.invoke("api:categoryCreate", rawCategory),
  categoryList: () => ipcRenderer.invoke("api:categoryList"),
  categoryUpdate: (rawCategory: string) => ipcRenderer.invoke("api:categoryUpdate", rawCategory),
  categoryDelete: (categoryId: number) => ipcRenderer.invoke("api:categoryDelete", categoryId),
})
