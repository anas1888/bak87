import { eliteNumbers } from '../elite.js'; // استيراد قائمة النخبة

let isEnabled = false; // لتحديد إذا كانت القاعدة مفعّلة
let intervalId = null;

export default {
  name: 'إعادة إضافة النخبة',
  command: ['إعادة_إضافة', 'اضافة'], 
  category: 'أدوات',
  description: 'إعادة إضافة أي عضو من النخبة إذا تم طرده من المجموعة تلقائيًا.',
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
      if (messageText.includes('إعادة_إضافة') || messageText.includes('اضافة')) {

        if (isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة مفعلة بالفعل.' });
        }

        isEnabled = true;
        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل القاعدة. سيتم إعادة إضافة أي عضو من النخبة إذا تم طرده.' });

        intervalId = setInterval(async () => {
          try {
            // التحقق من حالة المجموعة
            const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
            const currentParticipants = groupMetadata.participants.map(p => p.id);

            // مقارنة أعضاء النخبة مع الأعضاء الحاليين
            for (let eliteNumber of eliteNumbers) {
              if (!currentParticipants.includes(eliteNumber)) {
                try {
                  // محاولة إعادة إضافة العضو
                  await sock.groupParticipantsUpdate(m.key.remoteJid, [eliteNumber], 'add');
                  console.log(`✅ تم إعادة إضافة العضو ${eliteNumber} من النخبة.`);
                } catch (err) {
                  console.error(`⚠️ خطأ في إعادة إضافة العضو ${eliteNumber}:`, err);
                }
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

        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم إيقاف القاعدة. لن يتم إعادة إضافة أي عضو من النخبة بعد الآن.' });
      }

    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء تنفيذ الأمر:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};