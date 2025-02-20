import { eliteNumbers } from '../elite.js';

export default {
  name: 'فتح الشات', 
  command: ['فتح'], 
  category: 'كروب',  
  description: 'إعادة فتح الشات بحيث يمكن للجميع إرسال الرسائل.', 
  args: [], 
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) return;

    const senderNumber = m.key.participant;

    // التحقق من الصلاحيات
    if (!eliteNumbers.includes(senderNumber)) return;

    try {
      // فتح الشات - السماح للجميع بإرسال الرسائل
      console.log("فتح الشات: السماح للجميع بإرسال الرسائل");
      await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement'); // تغيير وضع المجموعة

      // رسالة تأكيد
      await sock.sendMessage(
        m.key.remoteJid, 
        { text: 'تم فتح شات 🎉.' }
      );
    } catch (error) {
      console.error('❌ حدث خطأ أثناء فتح الشات:', error);
    }
  },
};