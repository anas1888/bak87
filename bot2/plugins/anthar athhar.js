import fs from 'fs';

export default {
  name: 'عرض التحذيرات',
  command: ['عرض_انذار'],
  category: 'كروب',
  description: 'عرض عدد التحذيرات لكل شخص في المجموعة',
  execution: async ({ sock, m }) => {
    const groupId = m.key.remoteJid;
    if (!groupId.endsWith('@g.us')) return;

    const warningsFile = './warnings.json';
    let warningsData = {};

    // تحميل بيانات التحذيرات
    if (fs.existsSync(warningsFile)) {
      warningsData = JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
    }

    // التأكد من وجود بيانات تحذيرات للمجموعة
    if (!warningsData[groupId]) {
      return await sock.sendMessage(groupId, {
        text: '⚠️ لا توجد أي تحذيرات مسجلة في هذه المجموعة.'
      });
    }

    // صياغة قائمة التحذيرات
    let warningList = '*✥━━━✥ قائمة التحذيرات ✥━━━✥*\n';
    for (const [user, warnings] of Object.entries(warningsData[groupId])) {
      if (warnings > 0) {
        warningList += `👤 @${user.split('@')[0]} - تحذيرات: ${warnings}\n`;
      }
    }

    // التحقق من وجود تحذيرات
    if (warningList === '*✥━━━✥ قائمة التحذيرات ✥━━━✥*\n') {
      warningList += '✅ لا توجد تحذيرات لأي عضو.';
    }

    // إرسال القائمة مع الإشارة إلى الأعضاء
    await sock.sendMessage(groupId, {
      text: warningList,
      mentions: Object.keys(warningsData[groupId])
    });
  },
};