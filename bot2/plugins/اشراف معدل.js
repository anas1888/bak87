import { eliteNumbers } from '../elite.js'; // استيراد قائمة النخبة

let isEnabled = false; // متغير لتحديد ما إذا كانت القاعدة مفعلة أم لا
let intervalId = null; // لتخزين معرف التحقق الدوري

export default {
  name: 'إعادة إشراف',
  command: ['إعادة_إشراف', 'اعادة'], 
  category: 'أدوات',
  description: 'تفعيل أو إيقاف القاعدة بحيث يتم إعادة إشراف أي شخص من النخبة يتم إزالة إشرافه تلقائيًا.',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const admins = groupMetadata.participants.filter(p => p.admin === 'admin');
      const creator = groupMetadata.owner || groupMetadata.creator;

      const sender = m.key.participant;
      const isSenderAdmin = admins.some(admin => admin.id === sender);
      const isSenderCreator = sender === creator;

      if (!isSenderAdmin && !isSenderCreator) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ يجب أن تكون مشرفًا أو مؤسسًا لتفعيل هذه القاعدة.' });
      }

      const messageText = m.message?.conversation || '';
      if (messageText.includes('إعادة_إشراف') || messageText.includes('اعادة')) {

        if (isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة مفعلة بالفعل.' });
        }

        isEnabled = true;
        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل القاعدة. سيتم إعادة إشراف أي شخص من النخبة يتم إزالة إشرافه تلقائيًا.' });

        intervalId = setInterval(async () => {
          try {
            const groupMetadata = await sock.groupMetadata(m.key.remoteJid);

            for (let participant of groupMetadata.participants) {
              if (!participant.admin && eliteNumbers.includes(participant.id)) {
                await sock.groupParticipantsUpdate(m.key.remoteJid, [participant.id], 'promote');
              }
            }
          } catch (error) {
            console.error('⚠️ حدث خطأ أثناء التحقق الدوري:', error);
          }
        }, 1000); // فحص كل ثانية

      } else if (messageText.includes('توقف')) {
        if (!isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة غير مفعلة.' });
        }

        isEnabled = false;
        clearInterval(intervalId);
        intervalId = null;

        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم إيقاف القاعدة. لن يتم إعادة إشراف أي شخص من النخبة بعد الآن.' });
      }

    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء تنفيذ الأمر:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};