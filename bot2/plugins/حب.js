export default {
  name: 'نسبة الحب',
  command: ['نسبة'],
  category: 'ترفيه',
  description: 'يحدد نسبة الحب لشخص معين في المجموعة أو لشخص عشوائي.',
  args: ['@user'],
  execution: async ({ sock, m, args }) => {
    try {
      if (!m.key.remoteJid.endsWith('@g.us')) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: m });
      }

      let who;

      // التحقق من وجود منشن أو رد على رسالة أو إدخال يدوي
      if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        who = m.message.extendedTextMessage.contextInfo.mentionedJid[0]; // إذا كان هناك منشن
      } else if (m.quoted && m.quoted.participant) {
        who = m.quoted.participant; // إذا كان هناك رد على رسالة
      } else if (args[0] && args[0].includes('@')) {
        who = args[0].replace(/[@]/g, '') + '@s.whatsapp.net'; // إذا تم إدخال الرقم يدوياً
      }

      // إذا لم يتم تحديد شخص، اختيار شخص عشوائي من المجموعة
      if (!who) {
        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
        const groupMembers = groupMetadata.participants.map(p => p.id);
        who = groupMembers[Math.floor(Math.random() * groupMembers.length)];

        await sock.sendMessage(m.key.remoteJid, { text: '✨ لم يتم تحديد شخص، لذا تم اختيار شخص عشوائي من المجموعة.' }, { quoted: m });
      }

      // توليد نسبة حب عشوائية من 0 إلى 100
      const lovePercentage = Math.floor(Math.random() * 101);

      // رسالة النتيجة
      const message = `
💖 *نسبة الحب اليوم!* 💖

❤️ @${who.split('@')[0]} لديك نسبة حب: *${lovePercentage}%* ✨

🎯 نصيحة: ${lovePercentage > 70 ? 'أنت محبوب جدًا! استمر في نشر الحب 💕' : lovePercentage > 40 ? 'لديك فرصة جيدة، كن لطيفًا 😊' : 'يبدو أن الحظ ليس بجانبك اليوم! 😅'}

💘 *حظًا سعيدًا!* 🍀
      `;

      await sock.sendMessage(m.key.remoteJid, { text: message, mentions: [who] }, { quoted: m });
      
    } catch (error) {
      console.error('❌ خطأ في تنفيذ أمر نسبة الحب:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر، حاول مرة أخرى لاحقًا.' }, { quoted: m });
    }
  },
};