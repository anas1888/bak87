import fs from 'fs';
import { eliteNumbers } from '../elite.js'; // استيراد النخبة من الملف الخارجي

export default {
  name: 'نظام إزالة التحذيرات مع الأمنشن',
  command: ['مسح'],
  category: 'كروب',
  description: 'إزالة إنذار من شخص معين في المجموعة (فقط لأعضاء النخبة)',
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
      return await sock.sendMessage(groupId, { text: '❌ لا لا مش تستحق اصلا.' });
    }

    // جلب الشخص الممنشن
    const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!mentionedUser) {
      return await sock.sendMessage(groupId, { text: '⁉️ سوي منشن😑.' });
    }

    warningsData[groupId][mentionedUser] = warningsData[groupId][mentionedUser] || 0;

    // التحقق إذا كان الشخص لديه تحذيرات
    const currentWarnings = warningsData[groupId][mentionedUser];
    if (currentWarnings === 0) {
      return await sock.sendMessage(groupId, {
        text: `*💃 العضو ${mentionedUser.split('@')[0]} ليس لديه أي إنذار*`
      });
    }

    // تقليل عدد التحذيرات
    warningsData[groupId][mentionedUser] -= 1;

    // حفظ التحديثات
    fs.writeFileSync(warningsFile, JSON.stringify(warningsData));

    const updatedWarningsCount = warningsData[groupId][mentionedUser];

    await sock.sendMessage(groupId, {
      text: `*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*\n*✅ تم إزالة إنذار عن العضو ${mentionedUser.split('@')[0]}*\n*✨ التحذيرات الحالية : ${updatedWarningsCount}*\n*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*`
    });
  },
};