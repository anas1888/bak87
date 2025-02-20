import { eliteNumbers } from '../elite.js'; // استيراد قائمة النخبة

let isProtectionEnabled = false;

export default {
  name: 'حماية الإشراف',
  command: ['حماية'], 
  category: 'أدوات',
  description: 'تفعيل حماية الإشراف بحيث يتم خفض إشراف أي شخص يحاول إزالة إشراف مشرف آخر، إلا إذا كان من النخبة.',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const currentParticipants = groupMetadata.participants;

      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isBotAdmin = currentParticipants.some(p => p.id === botNumber && p.admin === 'admin');

      if (!isBotAdmin) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ لا يمكن تفعيل الحماية لأن البوت ليس مشرفًا.' });
      }

      if (isProtectionEnabled) {
        return sock.sendMessage(m.key.remoteJid, { text: '⚠️ الحماية مفعلة بالفعل.' });
      }

      isProtectionEnabled = true;
      await sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل حماية الإشراف.' });

      setInterval(async () => {
        if (!isProtectionEnabled) return;

        try {
          const updatedGroupMetadata = await sock.groupMetadata(m.key.remoteJid);
          const updatedParticipants = updatedGroupMetadata.participants;

          for (const participant of updatedParticipants) {
            // التحقق من أي محاولات لخفض الإشراف
            if (participant.admin === 'admin') {
              const participantId = participant.id;

              // تجاهل أعضاء النخبة
              if (eliteNumbers.includes(participantId)) continue;

              // خفض إشراف المشاركين غير النخبة
              await sock.groupParticipantsUpdate(m.key.remoteJid, [participantId], 'demote');
              await sock.sendMessage(m.key.remoteJid, { text: `⚠️ تم خفض إشراف ${participantId} من قبل البوت.` });
            }
          }
        } catch (error) {
          console.error(`⚠️ خطأ أثناء مراقبة الإشراف: ${error}`);
        }
      }, 2000); // فحص كل ثانيتين

    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء تنفيذ الأمر:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};