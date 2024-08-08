import { Ele } from "types/types"
import * as cheerio from 'cheerio';

export const getEleFromSourceCode = (origin: string, sourceCode: string): Ele => {
    let ele = {} as Ele
    const $ = cheerio.load(sourceCode)
    ele.title = $('title').text()
    ele.desc = $('meta[name="description"]').attr("content") as unknown as string
    let ico = $('link[rel="shortcut icon"]').attr("href")
    if (ico) {
        if (!ico.includes(origin)) ico = `${origin}${ico}`
        ele.link_logo = ico
    }
    const keywords = $('meta[name="keywords"]').attr("content")
    if (keywords) ele.keywords = keywords.split(",")
    return ele
}