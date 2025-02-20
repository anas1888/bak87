import { eliteNumbers } from '../elite.js'; // استيراد قائمة النخبة

let isEnabled = false; // متغير لتحديد ما إذا كانت القاعدة مفعلة أم لا
let intervalId = null; // لتخزين معرّف التحقق الدوري، بحيث يمكننا إيقافه لاحقًا

export default {
  name: 'إزالة إشراف',
  command: ['إزالة_إشراف', 'إلغاء'], // الأوامر التي يقوم البوت بمعالجتها
  category: 'أدوات',
  description: 'تفعيل أو إيقاف القاعدة بحيث يتم إزالة إشراف أي شخص ليس من النخبة.',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      // استخراج معلومات المجموعة
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const admins = groupMetadata.participants.filter(p => p.admin === 'admin'); // استخراج المشرفين
      const creator = groupMetadata.owner ? groupMetadata.owner : groupMetadata.creator; // استخدام owner في حال كان creator غير موجود

      // إذا كان الشخص الذي أرسل الرسالة مشرفًا أو مؤسسًا
      const sender = m.key.participant; // الشخص الذي أرسل الرسالة
      const isSenderAdmin = admins.some(admin => admin.id === sender); // التحقق من كونه مشرفًا
      const isSenderCreator = sender === creator; // تحقق إذا كان المرسل هو المؤسس

      // التحقق من أن المرسل إما مشرف أو مؤسس
      if (!isSenderAdmin && !isSenderCreator) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ يجب أن تكون مشرفًا أو مؤسسًا لتفعيل هذه القاعدة.' });
      }

      // استخراج النص من الرسالة
      const messageText = m.message?.conversation || ''; // نحصل على النص من الرسالة المرسلة

      // التحقق إذا كانت الرسالة تحتوي على الأمر المطلوب
      if (messageText.includes('إزالة_إشراف') || messageText.includes('إلغاء')) {

        // إذا كانت القاعدة مفعلة بالفعل
        if (isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة مفعلة بالفعل.' });
        }

        // تفعيل القاعدة
        isEnabled = true;
        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل القاعدة. سيتم إزالة إشراف أي شخص ليس من النخبة إذا تم منحه إشرافًا.' });

        // التحقق الدوري (كل 1000 ميلي ثانية - 1 ثانية)
        intervalId = setInterval(async () => {
          try {
            // تحديث معلومات المجموعة
            const groupMetadata = await sock.groupMetadata(m.key.remoteJid);

            // فحص المشاركين الذين تم منحهم إشرافًا
            for (let participant of groupMetadata.participants) {
              // إذا كان الشخص قد تم منحه إشرافًا
              if (participant.admin === 'admin') {
                // التحقق إذا كان الشخص ليس في قائمة النخبة
                if (!eliteNumbers.includes(participant.id)) {
                  // إزالة إشرافه تلقائيًا
                  await sock.groupParticipantsUpdate(m.key.remoteJid, [participant.id], 'demote');  // إزالة إشرافه
                  await sock.sendMessage(m.key.remoteJid, { text: `✅ تم إزالة إشراف العضو ${participant.id} لأنه ليس من النخبة.` });
                }
              }
            }
          } catch (error) {
            console.error('⚠️ حدث خطأ أثناء التحقق الدوري:', error);
          }
        }, 1000); // فحص كل 1000 ميلي ثانية (1 ثانية)

      } else if (messageText.includes('توقف')) {
        // إذا كانت الرسالة لإيقاف القاعدة
        if (!isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة غير مفعلة.' });
        }

        // إيقاف القاعدة
        isEnabled = false;
        clearInterval(intervalId); // إيقاف التحقق الدوري
        intervalId = null;

        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم إيقاف القاعدة. لن يتم إزالة إشراف أي شخص غير النخبة بعد الآن.' });
      }

    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء تنفيذ الأمر:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};