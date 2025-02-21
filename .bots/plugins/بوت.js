let handler = async (m, { command, text }) => m.reply(`> مـــرحـبـــا يا ｢${taguser}｣
*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*
*اسمي ابيس مطوري شيطان الاذاعه و يعتبر صديقي لذا لا تقترب منه☺️🔪 عايز تسخدم الاوامر اكتب👈｢.اوامر｣ و استخدم الاوامر في حاجه حسنه احسن لك🗿*
*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈* `.trim(), null, m.mentionedJid ? {
  mentions: m.mentionedJid
} : {})
await conn.sendMessage(m.chat, { react: { text: '🔪', key: m.key } })
    conn.sendFile(m.chat, 'https://qu.ax/nrLHp.jpg', message, m);
};

handler.help = ['الاوامر <teks>?']
handler.tags = ['الاوامر', 'fun']
handler.command = /^(abyss|ابيس|بوت|bot)$/i

export default handler