/** 接口-网路请求 */
import { ipcMain, IpcMainInvokeEvent, shell, net } from 'electron'
import { Ele } from 'types/types'
import { getDB } from './db/db'
import type { Database } from 'sqlite3'


export const registerApis = () => {
    ipcMain.on('api:openUrlWithDefaultBrowser', openUrlWithDefaultBrowser)
    ipcMain.handle('api:hackByUrl', hackByUrl)
    ipcMain.handle('api:eleCreate', eleCreate)
    ipcMain.handle('api:eleList', eleList)
    ipcMain.handle('api:eleUpdate', eleUpdate)
    ipcMain.handle('api:eleDelete', eleDelete)
}

export const eleCreate = (_event: IpcMainInvokeEvent, rawEle: string): Promise<number|Error> => {
    return new Promise<number>((resolve, reject) => {
        getDB().then((db: Database) => {
            let ele = JSON.parse(rawEle) as Ele
            !ele?.keywords && (ele.keywords = [])
            !ele?.desc && (ele.desc = "")
            !ele?.link_logo && (ele.link_logo = "")
            !ele?.num_order && (ele.num_order = 0)
            db.get('select count(*) as cnt from arrietti_ele where link_origin=?', [ele.link_origin], (err :Error|null, result: any): void => {
                err && reject(err)
                if (result?.cnt > 0) reject(new Error("当前站点已存在"))
            })
            .run(
                'insert into arrietti_ele (title,desc,keywords,link_logo,link,link_origin,num_order,is_accessible,created_at,updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [ele.title, ele.desc, ele.keywords?.join(','), ele.link_logo, ele.link, ele.link_origin, ele.num_order, ele.is_accessible, ele.created_at, ele.updated_at],
                (err: Error|null) => err&&reject(err)
            )
            .get('select id from arrietti_ele where link_origin=?', [ele.link_origin], (err :Error|null, result: any): void => err?reject(err):resolve(result.id))
        }).catch((err: Error) => reject(err))
    })
}

export const eleList = (_event: IpcMainInvokeEvent): Promise<string|Error> => {
    return new Promise<string|Error>((resolve, reject) => {
        getDB().then((db: Database) => {
            db.all<Ele>(
                "select * from arrietti_ele order by num_order desc, id desc",
                ((err: Error|null, raws: Ele[]) => {
                    err&&reject(err)
                    for (let idx = 0; idx < raws.length; idx++) {
                        if (typeof raws[idx].keywords === "string") {
                            raws[idx].keywords = raws[idx].keywords?(raws[idx].keywords as unknown as string).split(","):[]
                        }
                    }
                    resolve(JSON.stringify(raws))
                })
            )
        }).catch(err => reject(err))
    })
}

export const eleUpdate = (_event: IpcMainInvokeEvent, rawEle: string): Promise<boolean|Error> => {
    return new Promise<boolean>((resolve, reject) => {
        getDB().then((db: Database) => {
            let ele = JSON.parse(rawEle) as Ele
            !ele?.keywords && (ele.keywords = [])
            !ele?.desc && (ele.desc = "")
            !ele?.link_logo && (ele.link_logo = "")
            !ele?.num_order && (ele.num_order = 0)
            db.get('select count(*) as cnt from arrietti_ele where link_origin=? and id!=?', [ele.link_origin, ele.id], (err :Error|null, result: any): void => {
                err && reject(err)
                if (result?.cnt > 0) reject(new Error("当前站点已存在"))
            })
            .run(
                'update arrietti_ele set title=?, desc=?, keywords=?, link_logo=?, link=?, link_origin=?, num_order=?, updated_at=? where id=?',
                [ele.title, ele.desc, ele.keywords?.join(','), ele.link_logo, ele.link, ele.link_origin, ele.num_order, ele.updated_at, ele.id],
                (err => err?reject(err):resolve(true))
            )
        }).catch((err: Error) => reject(err))
    })
}

export const eleDelete = (_event: IpcMainInvokeEvent, eleId: number): Promise<boolean|Error> => {
    return new Promise<boolean|Error>((resolve, reject) => {
        getDB().then((db: Database) => {
            db.run(
                'delete from arrietti_ele where id=?', [eleId],
                ((err: Error|null) => err?reject(err):resolve(true))
            )
        }).catch(err => reject(err))
    })
}

export const openUrlWithDefaultBrowser = (_event: IpcMainInvokeEvent, url: string): void => {
    shell.openExternal(url)
    return ;
}

export const hackByUrl = async (_event: IpcMainInvokeEvent, url: string): Promise<any> => {
    const result = await net.fetch(url)
    return result.text()
}