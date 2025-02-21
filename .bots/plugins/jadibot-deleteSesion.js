import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fs } from "fs"
import path, { join } from 'path'

let handler = async (m, { conn, usedPrefix, command }, args) => {
    let parentw = conn
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let uniqid = `${who.split`@`[0]}`
    let userS = `${conn.getName(who)}`

    if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(
            m.chat, 
            { text: `*⚠️ استخدم هذا الأمر على البوت الرئيسي فقط*\n\nwa.me/${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}` },
            { quoted: m }
        )
    } else {
        try {
            await fs.rmdir("./jadibts/" + uniqid, { recursive: true, force: true })
            await conn.sendMessage(m.chat, { text: `*هتوحشني ${wm} سلام يا نجم! 🥹*` }, { quoted: m })
            await conn.sendMessage(m.chat, { text: `*⚠️ الجلسة تم إغلاقها ومسح كل آثارها*` }, { quoted: m })
        } catch (err) {
            if (err.code === 'ENOENT' && err.path === `./jadibts/${uniqid}`) {
                await conn.sendMessage(m.chat, { text: "أنت مش بوت مساعد أصلاً" }, { quoted: m })
            } else {
                console.error(userS + ' ' + `⚠️ حصل خطأ أثناء محاولة حذف الجلسة`, err)
            }
        }
    }
}

handler.command = /^(deletesess?ion|eliminarsesion|borrarsesion|delsess?ion|نضف)$/i
handler.private = true
handler.fail = null

export default handler