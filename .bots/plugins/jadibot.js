/*⚠ PROHIBIDO EDITAR ⚠

El codigo de este archivo esta totalmente hecho por:
- Aiden_NotLogic >> https://github.com/ferhacks

El codigo de este archivo fue parchado por:
- ReyEndymion >> https://github.com/ReyEndymion
- BrunoSobrino >> https://github.com/BrunoSobrino

Contenido adaptado por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import(global.baileys));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = "CkphZGlib3QsIEhlY2hv"
let drm2 = "IHBvciBAQWlkZW5fTm90TG9naWM"
let rtx = `*🔰 Alakreb-MD 🔰*\nㅤㅤㅤㅤ*Ser sub bot*\n\n*Con otro telefono que tengas o en la PC escanea este QR para convertirte en un sub bot*\n\n*1. Haga clic en los tres puntos en la esquina superior derecha*\n*2. Toca WhatsApp Web*\n*3. Escanee este codigo QR*\n*Este código QR expira en 45 segundos!*\n\n> *⚠️ No nos hacemos responsable del mal uso que se le pueda dar o si el numero se manda a soporte.. ustedes tienen el deber se seguir al pie de la letra los terminos y condiciones y privacidad (escribe eso y te los dará)*`
let rtx2 = `🟢 *_NUEVA FUNCIÓN DE HACERTE UN SUB BOT_* 🟢

*1️⃣ Diríjase en los tres puntos en la esquina superior derecha*
*2️⃣ Ir a la opción Dispositivos vinculados*
*3️⃣ da click en vincular con codigo de teléfono*
*4️⃣ pega el codigo a continuación*

> *⚠️ No nos hacemos responsable del mal uso que se le pueda dar o si el numero se manda a soporte.. ustedes tienen el deber se seguir al pie de la letra los terminos y condiciones y privacidad (escribe eso y te los dará)*`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const gataJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
//if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`)
//if (conn.user.jid !== global.conn.user.jid) return conn.reply(m.chat, `${lenguajeGB['smsJBPrincipal']()} wa.me/${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}`, m) 
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`  //conn.getName(who)
let pathGataJadiBot = path.join("./jadibts/", id)
if (!fs.existsSync(pathGataJadiBot)){
fs.mkdirSync(pathGataJadiBot, { recursive: true })
}
gataJBOptions.pathGataJadiBot = pathGataJadiBot
gataJBOptions.m = m
gataJBOptions.conn = conn
gataJBOptions.args = args
gataJBOptions.usedPrefix = usedPrefix
gataJBOptions.command = command
gataJadiBot(gataJBOptions)
} 
handler.command = /^(846464994|8494949|8484)/i
handler.register = true
export default handler 

export async function gataJadiBot(options) {
let { pathGataJadiBot, m, conn, args, usedPrefix, command } = options
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathGataJadiBot, "creds.json")
if (!fs.existsSync(pathGataJadiBot)){
fs.mkdirSync(pathGataJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `*⚠️ Use correctamente el comando:* \`${usedPrefix + command} code\``, m)
return
}
if (fs.existsSync(pathCreds)) {
let creds = JSON.parse(fs.readFileSync(pathCreds))
if (creds) {
if (creds.registered = false) {
fs.unlinkSync(pathGataJadiBot)
}}}
    
const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathGataJadiBot)
   
const connectionOptions = {
printQRInTerminal: false,
logger: pino({ level: 'silent' }),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
version: [2, 3000, 1015901307],
syncFullHistory: true,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['LoliBot-MD (Sub Bot)', 'Chrome','2.0.0'],
defaultQueryTimeoutMs: undefined,
getMessage: async (key) => {
if (store) {
//const msg = store.loadMessage(key.remoteJid, key.id)
//return msg.message && undefined
} return {
conversation: 'LoliBot-MD',
}}} 

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() + '\n' + drmer.toString("utf-8")}, { quoted: m})
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
txtCode = await conn.sendMessage(m.chat, { image: { url: 'https://qu.ax/wyUjT.jpg' || gataMenu.getRandom() }, caption: rtx2.trim() + '\n' + drmer.toString("utf-8") }, { quoted: m })
await sleep(3000)
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
codeBot = await m.reply(secret)}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
code ? console.log(code) : ''
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)		
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
//console.log(reason)
if (reason == 405 || reason == 401) {
fs.unlinkSync(pathCreds)
//thank you aiden_notLogic
return m?.chat ? await conn.sendMessage(m.chat, {text : `*Conexión interrumpida.* Usa el comando #serbot o #serbot + ID. Si el problema persiste, inicia sesión nuevamente con el comando #serbot code.\n\n> El ID es un mensaje con muchos caracteres que se le envio cuando se hizo sub bot` }, { quoted: null }) : '' //smsreenvia
}
if (reason === DisconnectReason.restartRequired) {
//await creloadHandler(true).catch(console.error)
return console.log(`⚠️ CONEXIÓN REEMPLAZADA, SE HA ABIERTO OTRA NUEVA SESION, POR FAVOR, CIERRA LA SESIÓN ACTUAL PRIMERO`);   
} else if (reason === DisconnectReason.loggedOut) {
sleep(4000)
return conn.sendMessage(`${path.basename(pathGataJadiBot)}@s.whatsapp.net`, {text : `🔴 *LA CONEXIÓN SE HA CERRADO, TENDRAS QUE VOLVER A CONECTARSE USANDO:*\n#deletesesion (Para borrar los datos y poder volver a solita el QR o el code)` }, { quoted: null })
//m.reply(lenguajeGB['smsJBConexionClose2']())
} else if (reason == 428) {
await endSesion(false)
return conn.sendMessage(m.chat, {text : `*Ha cerrado sesión o hubo una interrupción inesperada*\n\nUsa el comando *${usedPrefix}serbot* o *${usedPrefix}serbot + ID*. Si el problema persiste, inicia sesión nuevamente con el comando *${usedPrefix}serbot code*.\n\n> _El *ID* es un mensaje con muchos caracteres que fue enviado cuando se hizo sub bot._` }, { quoted: null }) //smsJBConexion
//m.reply(lenguajeGB['smsJBConexion']())
} else if (reason === DisconnectReason.connectionLost) {
//await jddt()
return console.log(`⚠️ CONEXIÓN PERDIDA CON EL SERVIDOR, RECONECTANDO...`); 
} else if (reason === DisconnectReason.badSession) {
return await conn.sendMessage(m.chat, {text : `🔴 *LA CONEXIÓN SE HA CERRADO, DEBERÁ DE CONECTARSE MANUALMENTE USANDO EL COMANDO #serbot Y REESCANEAR EL NUEVO CÓDIGO QR*` }, { quoted: null })
//m.reply(lenguajeGB['smsJBConexionClose']())
} else if (reason === DisconnectReason.timedOut) {
await endSesion(false)
return console.log(`⌛ TIEMPO DE CONEXIÓN AGOTADO, RECONECTANDO...`)
} else {
console.log(`⚠️❗ RAZON DE DESCONEXIÓN DESCONOCIDA: ${reason || ''} >> ${connection || ''}`); 
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathGataJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n▣─────────────────────────────···\n│\n│❧ ${userName} (+${path.basename(pathGataJadiBot)})  𝚂𝚄𝙱-𝙱𝙾𝚃 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾 𝙲𝙾𝚁𝚁𝙴𝙲𝚃𝙰𝙼𝙴𝙽𝚃𝙴✅\n│\n▣─────────────────────────────···`))
sock.isInit = true
global.conns.push(sock)
//let user = global.db.data.users[m.sender]
let user = global.db.data.users[`${path.basename(pathGataJadiBot)}@s.whatsapp.net`]
m?.chat ? await conn.sendMessage(m.chat, {text : args[0] ? `✅ Ya esta conectado!! Por favor espere se esta cargador los mensajes.....*` : `*Conectado exitosamente con WhatsApp ✅*\n\n*💻 Bot:* +${path.basename(pathGataJadiBot)}\n*👤 Dueño:* ${userName}\n\n*Nota: Esto es temporal*\nSi el Bot principal se reinicia o se desactiva, todos los sub bots tambien lo haran\n\n> *Unirte a nuestro canal para informarte de todas la Actualizaciónes/novedades sobre el bot*\n${nna2}`}, { quoted: m }) : ''
let chtxt = `*Se detectó un nuevo Sub-Bot conectado 💻✨*

*✨ Bot :* wa.me/${path.basename(pathGataJadiBot)}
*👤 Dueño :* ${userName}
*🔑 Método de conexión :* ${mcode ? 'Código de 8 dígitos' : 'Código QR'}
*💻 Navegador :* ${mcode ? 'Ubuntu' : 'Chrome'}
`.trim()
let ppch = await sock.profilePictureUrl(userJid, 'image').catch(_ => imageUrl.getRandom())
await sleep(3000)
//if (global.conn.user.jid.split`@`[0] != sock.user.jid.split`@`[0]) {
await conn.sendMessage(ch.ch1, { text: chtxt, contextInfo: {
externalAdReply: {
title: "【 📢 Notificación General 📢 】",
body: '🥳 ¡Nuevo Sub-Bot conectado!',
thumbnailUrl: ppch,
sourceUrl: [nna, nna2, nn, md, yt, tiktok].getRandom(),
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
//}
await sleep(3000)
await joinChannels(sock)
//await conn.sendMessage(m.chat, {text : `${lenguajeGB['smsJBCargando'](usedPrefix)}`}, { quoted: m })
if (!args[0]) m?.chat ? conn.sendMessage(m.chat, {text : usedPrefix + command + " " + Buffer.from(fs.readFileSync(pathCreds), "utf-8").toString("base64")}, { quoted: m }) : ''    
//await sleep(5000)
//if (!args[0]) conn.sendMessage(m.chat, {text: usedPrefix + command + " " + Buffer.from(fs.readFileSync("./jadibts/" + uniqid + "/creds.json"), "utf-8").toString("base64")}, { quoted: m })
}}

setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
//console.log(await creloadHandler(true).catch(console.error))
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)		
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
													 
} catch (e) {
console.error('Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off('messages.upsert', sock.handler)
sock.ev.off('group-participants.update', sock.participantsUpdate)
sock.ev.off('groups.update', sock.groupsUpdate)
sock.ev.off('message.delete', sock.onDelete)
sock.ev.off('call', sock.onCall)
sock.ev.off('connection.update', sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}
sock.welcome = global.conn.welcome + ''
sock.bye = global.conn.bye + ''
sock.spromote = global.conn.spromote + ''
sock.sdemote = global.conn.sdemote + '' 
sock.sDesc = global.conn.sDesc + '' 
sock.sSubject = global.conn.sSubject + '' 
sock.sIcon = global.conn.sIcon + '' 
sock.sRevoke = global.conn.sRevoke + '' 

sock.handler = handler.handler.bind(sock)
sock.participantsUpdate = handler.participantsUpdate.bind(sock)
sock.groupsUpdate = handler.groupsUpdate.bind(sock)
sock.onDelete = handler.deleteUpdate.bind(sock)
sock.onCall = handler.callUpdate.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)

sock.ev.on(`messages.upsert`, sock.handler)
sock.ev.on(`group-participants.update`, sock.participantsUpdate)
sock.ev.on(`groups.update`, sock.groupsUpdate)
sock.ev.on(`message.delete`, sock.onDelete)
sock.ev.on(`call`, sock.onCall)
sock.ev.on(`connection.update`, sock.connectionUpdate)
sock.ev.on(`creds.update`, sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}