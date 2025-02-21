import ws from 'ws';

async function handler(m, { conn: _envio, usedPrefix }) {
  const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
  
  function convertirMsADiasHorasMinutosSegundos(ms) {
    var segundos = Math.floor(ms / 1000);
    var minutos = Math.floor(segundos / 60);
    var horas = Math.floor(minutos / 60);
    var días = Math.floor(horas / 24);
    segundos %= 60;
    minutos %= 60;
    horas %= 24;
    var resultado = "";
    
    if (días !== 0) {
      resultado += días + " أيام، ";
    }
    if (horas !== 0) {
      resultado += horas + " ساعات، ";
    }
    if (minutos !== 0) {
      resultado += minutos + " دقائق، ";
    }
    if (segundos !== 0) {
      resultado += segundos + " ثواني";
    }
    return resultado;
  }

  const message = users.map((v, index) => `👉🏻 wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado (${v.user.name || '-'})\n*🔰 الوقت النشط :* ${ v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : "مجهول"}`).join('\n\n');
  
  const replyMessage = message.length === 0 ? '*لا توجد بوتات فرعية متصلة، يرجى التحقق لاحقاً.*' : message;
  const totalUsers = users.length;

  const responseMessage = `*🤖 إليك قائمة ببعض البوتات الفرعية (العقرب بوت) 🤖️*\n\n*👉🏻 يمكنك الاتصال بهم لمعرفة ما إذا كانوا سينضمون إلى مجموعتك*\n\n*من فضلك:*\n*1.- كن لطيفًا ✅*\n*2.- لا تصر أو تناقش ✅*\n\n*✳ إذا ظهر النص التالي فارغًا، فهذا يعني أنه لا توجد بوتات فرعية متاحة في الوقت الحالي، يرجى المحاولة لاحقًا*\n\n*_⚠ ملاحظة: ️هم أشخاص لا نعرفهم.. لذا فإن فريق العقرب بوت غير مسؤول عما قد يحدث هناك.._*\n\n*🤖 عدد البوتات الفرعية المتصلة :* ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();

  await _envio.sendMessage(m.chat, { text: responseMessage, contextInfo: { mentionedJid: _envio.parseMention(responseMessage), externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: wm, body: '𝐒𝐮𝐩𝐞𝐫 𝐁𝐨𝐭 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩', previewType: 0, thumbnail: img.getRandom(), sourceUrl: redes.getRandom() } } }, { quoted: m });
}

handler.command = handler.help = ['بوتات', 'bots'];
handler.tags = ['jadibot'];
handler.register = true;

export default handler;