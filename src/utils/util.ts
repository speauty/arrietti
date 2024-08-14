import { Ele } from "types/types"
import * as cheerio from 'cheerio';

export const getEleFromSourceCode = (origin: string, sourceCode: string): Ele => {
    let ele = {} as Ele
    const $ = cheerio.load(sourceCode)
    ele.title = $('title').text()
    const keysForDesc: string[] = ["Description", "description"]
    for (let idx = 0; idx < keysForDesc.length; idx++) {
        ele.desc = $(`meta[name="${keysForDesc[idx]}"]`).attr("content") as unknown as string
        if (ele.desc) break
    }
    const keysForIcon: string[] = ["icon", "shortcut icon"]
    let ico: string = ""
    for (let idx = 0; idx < keysForIcon.length; idx++) {
        ico = $(`link[rel="${keysForIcon[idx]}"]`).attr("href") as unknown as string
        if (ico) break
    }
    !ico && (ico = "favicon.ico")
    // https://doc.thinkphp.cn/v6_1/default.html 图标回显失败-304-涉及重定向, net请求问题
    // https://www.bilibili.com/ 图标回显失败-403-跨域
    if (!ico.includes("base64,") && !ico.startsWith("//") && !ico.includes("https://") && !ico.includes("http://")) {
        ico[0] !== "/" && (ico = `/${ico}`)
        ico = `${origin}${ico}`
    }
    ele.link_logo = ico
    const keywords = $('meta[name="keywords"]').attr("content")
    if (keywords) {
        let charSplited = ""
        if (keywords.includes(',')) {
            charSplited = ','
        } else if (keywords.includes("，")) {
            charSplited = '，'
        } else if (keywords.includes(" ")) {
            charSplited = ' '
        }
        ele.keywords = charSplited?keywords.split(charSplited):[keywords]
    }
    return ele
}

export const getErrorMessage = (err: Error): string => {
    if (!err.message.includes("remote method")) return err.message
    return err.message.split("Error: ")[1]
}