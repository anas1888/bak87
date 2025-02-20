import { eliteNumbers } from '../elite.js';

export default {
  name: 'طرد', 
  command: ['باي'], 
  category: 'كروب',  
  description: 'طرد عضو عند منشنه.', 
  args: ['@user'], 
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) return;

    const senderNumber = m.key.participant;

    // التحقق من صلاحيات المرسل
    if (!eliteNumbers.includes(senderNumber)) {
      return; // إنهاء التنفيذ دون إرسال أي رد
    }

    // التحقق من وجود منشن في الرسالة
    const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentionedJids.length === 0) {
      return; // إنهاء التنفيذ دون إرسال أي رد
    }

    try {
      // طرد جميع الأعضاء المذكورين في المنشن
      for (const jid of mentionedJids) {
        console.log(`طرد العضو: ${jid}`);
        await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'remove'); // تنفيذ الطرد
      }

      // يمكن حذف رسالة التأكيد إذا كنت لا تريد أي رد
      await sock.sendMessage(
        m.key.remoteJid, 
        { text: 'تم كتم النفس.' }
      );
    } catch (error) {
      console.error('اكو شي غريب:', error);
    }
  },
};