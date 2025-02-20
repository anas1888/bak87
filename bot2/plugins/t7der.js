import fs from 'fs';
import { eliteNumbers } from '../elite.js'; // استيراد النخبة من الملف الخارجي

export default {
  name: 'نظام التحذيرات مع الأمنشن',
  command: ['انذار'],
  category: 'كروب',
  description: 'نظام تحذيرات مع إمكانية ذكر الشخص عند التحذير وإزالته بعد 3 تحذيرات (فقط لأعضاء النخبة)',
  execution: async ({ sock, m, args }) => {
    const groupId = m.key.remoteJid;
    if (!groupId.endsWith('@g.us')) return;

    const warningsFile = './warnings.json';
    let warningsData = {};

    // تحميل بيانات التحذيرات
    if (fs.existsSync(warningsFile)) {
      warningsData = JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
    }

    // التأكد من أن المرسل موجود في البيانات
    const sender = m.key.participant;
    warningsData[groupId] = warningsData[groupId] || {};

    // **التحقق من أن المرسل هو عضو نخبة**
    if (!eliteNumbers.includes(sender)) {
      return await sock.sendMessage(groupId, { text: 'هيهيهيهيهيه دز العاب بعيد 🫐.' });
    }

    // **جلب الشخص الممنشن**
    const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!mentionedUser) {
      return await sock.sendMessage(groupId, { text: 'سوى منشن يا جمد 😂.' });
    }

    warningsData[groupId][mentionedUser] = warningsData[groupId][mentionedUser] || 0;

    // زيادة عدد التحذيرات للشخص الممنشن
    warningsData[groupId][mentionedUser] += 1;

    // حفظ بيانات التحذيرات
    fs.writeFileSync(warningsFile, JSON.stringify(warningsData));

    const warningsCount = warningsData[groupId][mentionedUser];

    // إرسال تحذير
    await sock.sendMessage(groupId, {
      text: `*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*\n*⚠️ تم تحذير العضو ${mentionedUser.split('@')[0]}*\n*🚫 التحذيرات الحالية : ${warningsCount}*\n*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*.`
    });

    // إذا وصل الشخص إلى 3 تحذيرات، يتم إزالته
    if (warningsCount >= 3) {
      await sock.sendMessage(groupId, {
        text: `ورع ما تسماع كلام ${mentionedUser.split('@')[0]} إبلاع طرد 😂.`
      });

      // استخدام groupParticipantsUpdate لإزالة العضو
      await sock.groupParticipantsUpdate(groupId, [mentionedUser], 'remove');
      
      // إعادة تعيين التحذيرات بعد الإزالة
      warningsData[groupId][mentionedUser] = 0;
      fs.writeFileSync(warningsFile, JSON.stringify(warningsData));
    }
  },
};