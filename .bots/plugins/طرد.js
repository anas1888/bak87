let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let developerNumber = '201063808608@s.whatsapp.net'; // استبدل بالرقم الخاص بالمطور بصيغة JID

  let kickte = `*مــنشـن الـشـخص !*`;

  if (!m.mentionedJid[0] && !m.quoted)
    return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  // التحقق إذا كان المستخدم هو المطور
  if (user === developerNumber) {
    return m.reply(
      `*عايزني أطرد مطوري ليه؟ أنا أحول زيك ولا إيه؟!*`,
      m.chat,
      { mentions: [developerNumber] }
    );
  }

  let owr = m.chat.split`-`[0];
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
  m.reply(
    `*تـــم طردك من النقابة بواسطة زيرو بوت، تعالي بوس حذائي عشان أرجعك!*`
  );
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick', 'طرد'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;