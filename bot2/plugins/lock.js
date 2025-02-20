import { eliteNumbers } from '../elite.js';

export default {
  name: 'ايقاف الشات', 
  command: ['قفل'], 
  category: 'إدارة',  
  description: 'إيقاف الشات بحيث لا يمكن للأعضاء إرسال الرسائل إلا المشرفين.', 
  args: [], 
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    const senderNumber = m.key.participant;
    console.log("الرقم المرسل: ", senderNumber);

    // تحقق من أن المرسل من النخبة
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(m.key.remoteJid, { text: 'دز حشرة.' });
    }

    try {
      // تحديث إعدادات إرسال الرسائل
      console.log("إيقاف الشات: السماح للمشرفين فقط بإرسال الرسائل");
      await sock.groupSettingUpdate(m.key.remoteJid, 'announcement'); // تغيير وضع المجموعة إلى "إعلان"

      // إرسال رسالة تأكيد
      await sock.sendMessage(
        m.key.remoteJid, 
        { text: '✅ تم اخراس الجميع.' }
      );
    } catch (error) {
      console.error('حدث خطأ أثناء تنفيذ الأمر:', error);
      sock.sendMessage(m.key.remoteJid, { text: 'ما عندي.' });
    }
  },
};