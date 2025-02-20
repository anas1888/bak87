import { eliteNumbers } from '../elite.js';

export default {
  name: 'رفع', 
  command: ['رفع'], 
  category: 'كروب',  
  description: 'رفع الشخص الي تم منشنته.', 
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
      return sock.sendMessage(m.key.remoteJid, { text: 'منشن شخص لي تبي رفع إشرف 😑' });
    }

    try {
      for (const mentioned of mentionedParticipants) {
        console.log(`رفع الشخص المشارك: ${mentioned}`);
        await sock.groupParticipantsUpdate(m.key.remoteJid, [mentioned], 'promote'); // اعطاء اشراف
      }

      // رسالة نجاح
      await sock.sendMessage(m.key.remoteJid, { text: 'تم🌝' });
    } catch (error) {
      console.error('تريد ترفع وانت عضو', error);
      await sock.sendMessage(m.key.remoteJid, { text: 'تريد ترفع وانت عضو.' });
    }
  },
};