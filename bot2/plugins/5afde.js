import { eliteNumbers } from '../elite.js';

export default {
  name: 'تخفيض', 
  command: ['خفض'], 
  category: 'كروب',  
  description: 'إزالة الإشراف عن الشخص الذي يتم منشنه في المجموعة.', 
  args: [], 
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) return;

    const senderNumber = m.key.participant;

    // التحقق من صلاحيات المرسل
    if (!eliteNumbers.includes(senderNumber)) {
      return; // لا تفعل شيء إذا لم يكن الشخص من النخبة، ولا ترسل أي رسالة
    }

    // التحقق من وجود منشن
    const mentionedParticipants = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (mentionedParticipants.length === 0) {
      return sock.sendMessage(m.key.remoteJid, { text: 'منشن شخص لي تبي انزل إشرف 😑' });
    }

    try {
      for (const mentioned of mentionedParticipants) {
        console.log(`إزالة الإشراف عن المشارك: ${mentioned}`);
        await sock.groupParticipantsUpdate(m.key.remoteJid, [mentioned], 'demote'); // إزالة الإشراف
      }

      // رسالة نجاح
      await sock.sendMessage(m.key.remoteJid, { text: 'تم👑' });
    } catch (error) {
      console.error('اشراف 🙂', error);
      await sock.sendMessage(m.key.remoteJid, { text: 'اشراف 🙂.' });
    }
  },
};