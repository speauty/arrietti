/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface API {
  openUrlWithDefaultBrowser: (url: string) => void,
  hackByUrl: (url: string) => Promise<any>,
  eleCreate: (rawEle: string) => Promise<number|Error>,
  eleList: (rawPage: string, rawEle: string) => Promise<string|Error>,
  eleUpdate: (rawEle: string) => Promise<boolean|Error>,
  eleDelete: (eleId: number) => Promise<boolean|Error>,
  categoryCreate: (rawCategory: string) => Promise<number|Error>,
  categoryList: () => Promise<string|Error>,
  categoryUpdate: (rawCategory: string) => Promise<boolean|Error>,
  categoryDelete: (categoryId: number) => Promise<boolean|Error>,
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  api: API
}
