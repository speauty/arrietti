/** 接口-网路请求 */
import { ipcMain, IpcMainInvokeEvent, shell, net } from 'electron'
import { Category, Ele, Page } from 'types/types'
import { getDB } from './db/db'
import type { Database } from 'sqlite3'


export const registerApis = () => {
    ipcMain.on('api:openUrlWithDefaultBrowser', openUrlWithDefaultBrowser)
    ipcMain.handle('api:hackByUrl', hackByUrl)
    ipcMain.handle('api:eleCreate', eleCreate)
    ipcMain.handle('api:eleList', eleList)
    ipcMain.handle('api:eleUpdate', eleUpdate)
    ipcMain.handle('api:eleDelete', eleDelete)

    ipcMain.handle('api:categoryCreate', categoryCreate)
    ipcMain.handle('api:categoryList', categoryList)
    ipcMain.handle('api:categoryUpdate', categoryUpdate)
    ipcMain.handle('api:categoryDelete', categoryDelete)
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
                if (result?.cnt > 0) {
                    reject(new Error("当前收藏已存在"))
                } else {
                    db.run(
                        'insert into arrietti_ele (title,desc,keywords,link_logo,link,link_origin,num_order,is_accessible,created_at,updated_at,category_id,category_title) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            ele.title, ele.desc, ele.keywords?.join(','), ele.link_logo, ele.link, ele.link_origin, ele.num_order, ele.is_accessible, ele.created_at, ele.updated_at,
                            ele.category_id, ele.category_title,
                        ],
                        (err: Error|null) => {
                            if (err) {
                                reject(err)
                            } else {
                                db.get('select id from arrietti_ele where link_origin=?', [ele.link_origin], (err :Error|null, result: any): void => err?reject(err):resolve(result.id))
                            }
                        }
                    )
                }
            })
        }).catch((err: Error) => reject(err))
    })
}

export const eleList = (_event: IpcMainInvokeEvent, rawPage: string): Promise<string|Error> => {
    const page: Page = rawPage?JSON.parse(rawPage) as Page:{} as Page
    (!page.page || page.page < 1) && (page.page = 1);
    (!page.page_size || page.page_size < 100) && (page.page_size = 100);
    return new Promise<string|Error>((resolve, reject) => {
        getDB().then((db: Database) => {
            db.all<Ele>(
                "select * from arrietti_ele order by num_order desc, id desc limit ?, ?",
                [( page.page - 1) * page.page_size, page.page_size],
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
                if (result?.cnt > 0) {
                    reject(new Error("当前收藏已存在"))
                } else {
                    db.run(
                        'update arrietti_ele set title=?, desc=?, keywords=?, link_logo=?, link=?, link_origin=?, num_order=?, updated_at=?, category_id=?, category_title=? where id=?',
                        [ele.title, ele.desc, ele.keywords?.join(','), ele.link_logo, ele.link, ele.link_origin, ele.num_order, ele.updated_at, ele.category_id, ele.category_title, ele.id],
                        (err => err?reject(err):resolve(true))
                    )
                }
            })
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

export const categoryCreate = (_event: IpcMainInvokeEvent, rawCategory: string): Promise<number|Error> => {
    return new Promise<number>((resolve, reject) => {
        getDB().then((db: Database) => {
            let category = JSON.parse(rawCategory) as Category
            !category?.num_order && (category.num_order = 0)
            db.get('select count(*) as cnt from arrietti_category where title=?', [category.title], (err :Error|null, result: any): void => {
                err && reject(err)
                if (result?.cnt > 0) {
                    reject(new Error("当前分类已存在"))
                } else {
                    db.run(
                        'insert into arrietti_category (title,num_order,created_at,updated_at) values (?, ?, ?, ?)',
                        [category.title, category.num_order, category.created_at, category.updated_at],
                        (err: Error|null) => {
                            if (err) {
                                reject(err)
                            } else {
                                db.get('select id from arrietti_category where title=?', [category.title], (err :Error|null, result: any): void => err?reject(err):resolve(result.id))
                            }
                        }
                    )
                }
            })
        }).catch((err: Error) => reject(err))
    })
}

export const categoryList = (_event: IpcMainInvokeEvent): Promise<string|Error> => {
    return new Promise<string|Error>((resolve, reject) => {
        getDB().then((db: Database) => {
            db.all<Category>(
                "select * from arrietti_category order by num_order desc, id desc",
                ((err: Error|null, raws: Category[]) => {
                    err&&reject(err)
                    resolve(JSON.stringify(raws))
                })
            )
        }).catch(err => reject(err))
    })
}

export const categoryUpdate = (_event: IpcMainInvokeEvent, rawCategory: string): Promise<boolean|Error> => {
    return new Promise<boolean>((resolve, reject) => {
        getDB().then((db: Database) => {
            let category = JSON.parse(rawCategory) as Category
            !category?.num_order && (category.num_order = 0)
            db.get('select count(*) as cnt from arrietti_category where title=? and id!=?', [category.title, category.id], (err :Error|null, result: any): void => {
                err && reject(err)
                if (result?.cnt > 0) {
                    reject(new Error("当前分类已存在"))
                } else {
                    db.run(
                        'update arrietti_category set title=?, num_order=?, updated_at=? where id=?',
                        [category.title, category.num_order, category.updated_at, category.id],
                        (err => err?reject(err):resolve(true))
                    ).run('update arrietti_ele set category_title = ? where category_id = ?', [category.title, category.id])
                }
            })
        }).catch((err: Error) => reject(err))
    })
}

export const categoryDelete = (_event: IpcMainInvokeEvent, categoryId: number): Promise<boolean|Error> => {
    return new Promise<boolean|Error>((resolve, reject) => {
        getDB().then((db: Database) => {
            db.get('select count(*) as cnt from arrietti_ele where category_id=?', [categoryId], (err :Error|null, result: any): void => {
                err && reject(err)
                if (result?.cnt > 0) {
                    reject(new Error("当前分类下面存在收藏, 请手动转移或删除相应收藏"))
                } else {
                    db.run(
                        'delete from arrietti_category where id=?', [categoryId],
                        ((err: Error|null) => err?reject(err):resolve(true))
                    )
                }
            })
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