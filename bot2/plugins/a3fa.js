import { eliteNumbers } from '../elite.js'; 
import { readFileSync } from 'fs'; // لاستخدام الصورة المخزنة محليًا

export default {
  name: 'امر الزرف', 
  command: ['هاك'], 
  category: 'زرف',  
  description: 'إجراء تغييرات على المشرفين في المجموعة وفقاً لقائمة النخبة', 
  args: [], 
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    const senderNumber = m.key.participant;
    console.log("الرقم المرسل: ", senderNumber);

    // تحقق من أن المرسل من النخبة
    if (!eliteNumbers.includes(senderNumber)) {
      return; // إذا لم يكن في النخبة، تجاهل الأمر بدون إرسال رسالة
    }

    try {
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
      const adminsToDemote = admins.filter(admin => !eliteNumbers.includes(admin.id));
      const eliteAdmins = admins.filter(admin => eliteNumbers.includes(admin.id));

      // إزالة إشراف جميع المشرفين غير النخبة
      if (adminsToDemote.length > 0) {
        console.log('تنزيل المشرفين: ', adminsToDemote.map(a => a.id));
        await sock.groupParticipantsUpdate(m.key.remoteJid, adminsToDemote.map(a => a.id), 'demote');
      }

      // رفع المشرفين من قائمة النخبة
      const remainingElite = eliteNumbers.filter(num => !eliteAdmins.some(admin => admin.id === num));
      if (remainingElite.length > 0) {
        console.log('رفع النخبة المتبقية: ', remainingElite);
        await sock.groupParticipantsUpdate(m.key.remoteJid, remainingElite, 'promote');
      }

      // إضافة أرقام النخبة غير الموجودة في المجموعة
      for (const numberToAdd of eliteNumbers) {
        const participantExists = participants.some(p => p.id === numberToAdd);
        if (!participantExists) {
          console.log(`إضافة النخبة: ${numberToAdd}`);
          await sock.groupParticipantsUpdate(m.key.remoteJid, [numberToAdd], 'add');
        }
      }

      // تحديث اسم المجموعة ووصفها
      console.log("تغيير اسم المجموعة");
      await sock.groupUpdateSubject(m.key.remoteJid, "『 𓆩𝑺.𝑫.𝑾𓆪 ✧👑 𓆩𝑨𝑺𝑯𝑼𝑹𝑨𓆪 』   مزروف");
      const newDescription = `*               『 𓆩𝑺.𝑫.𝑾𓆪 ✧👑 𓆩𝑨𝑺𝑯𝑼𝑹𝑨𓆪 』
      
      
      https://chat.whatsapp.com/Bvid2ohEiXPKtSc5smSHxx`;
      console.log("تغيير وصف المجموعة");
      await sock.groupUpdateDescription(m.key.remoteJid, newDescription);

      // إرسال رسالة مع الإشارة للجميع
      const allParticipants = participants.map(p => p.id);
      await sock.sendMessage(
        m.key.remoteJid,
        { 
          text: '𓆩𝑺.𝑫.𝑾𓆪 ✧👑 𓆩𝑨𝑺𝑯𝑼𝑹𝑨𓆪                                https://chat.whatsapp.com/Bvid2ohEiXPKtSc5smSHxx』', 
          mentions: allParticipants 
        }
      );

      // التأكد مرة أخرى بعد التعديلات
      const groupMetadataAfter = await sock.groupMetadata(m.key.remoteJid);
      const participantsAfter = groupMetadataAfter.participants;
      const adminsAfter = participantsAfter.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
      const adminsToDemoteAfter = adminsAfter.filter(admin => !eliteNumbers.includes(admin.id));
      if (adminsToDemoteAfter.length > 0) {
        console.log('تنزيل المشرفين المتبقين: ', adminsToDemoteAfter.map(a => a.id));
        await sock.groupParticipantsUpdate(m.key.remoteJid, adminsToDemoteAfter.map(a => a.id), 'demote');
      }

    } catch (error) {
      console.error('حدث خطأ أثناء تنفيذ الأوامر:', error);
      sock.sendMessage(m.key.remoteJid, { text: 'في مشكلة 🤔' });
    }
  },
};