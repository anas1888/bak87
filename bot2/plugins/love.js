import { eliteNumbers } from '../elite.js';

export default {
  name: 'من أكثر شخص يحبك',
  command: ['نسبة_حب'],
  category: 'ترفيه',
  description: 'يختار بشكل عشوائي الشخص الذي يحبك أكثر في المجموعة.',
  args: [],
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    const senderNumber = m.key.participant;
    console.log("الرقم المرسل: ", senderNumber);

    // تحقق من أن المرسل من النخبة
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(m.key.remoteJid, { text: 'محدش بي حبك دز.' });
    }

    // الحصول على قائمة الأعضاء في المجموعة
    const groupMembers = await sock.groupMetadata(m.key.remoteJid).then(metadata => metadata.participants);
    
    // اختيار شخص عشوائي من الأعضاء
    const randomMember = groupMembers[Math.floor(Math.random() * groupMembers.length)];

    // إرسال رسالة توضح من هو الشخص الذي يحبك أكثر
    await sock.sendMessage(
      m.key.remoteJid, 
      { text: `*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*\nأكثر شخص يحبك في هذه المجموعة هو\n *@${randomMember.id.split('@')[0]}* 💖\n*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*` }
    );
  },
};