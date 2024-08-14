import { Ele } from "types/types"
import * as cheerio from 'cheerio';

export const getEleFromSourceCode = (origin: string, sourceCode: string): Ele => {
    let ele = {} as Ele
    const $ = cheerio.load(sourceCode)
    ele.title = $('title').text()
    ele.desc = $('meta[name="description"]').attr("content") as unknown as string
    let ico = $('link[rel="icon"]').attr("href")
    if (!ico) {
        ico = $('link[rel="shortcut icon"]').first().attr("href")
    }
    if (ico) {
        if (!ico.includes("base64,") && !ico.startsWith("//") && !ico.includes("https://") && !ico.includes("http://")) {
            ico[0] !== "/" && (ico = `/${ico}`)
            ico = `${origin}${ico}`
        }
        ele.link_logo = ico
    }
    const keywords = $('meta[name="keywords"]').attr("content")
    if (keywords) {
        let charSplited = ""
        if (keywords.includes(',')) {
            charSplited = ','
        } else if (keywords.includes("，")) {
            charSplited = '，'
        }
        ele.keywords = charSplited?keywords.split(charSplited):[keywords]
    }
    return ele
}

export const getErrorMessage = (err: Error): string => {
    if (!err.message.includes("remote method")) return err.message
    return err.message.split("Error: ")[1]
}