import fs from 'fs';
import path from 'path';
import { eliteNumbers } from '../elite.js';

const eliteFilePath = path.resolve('./elite.js');

export default {
  name: 'manageElite',
  command: ['اضف', 'حذف', 'عرض'],
  category: 'إدارة',
  description: 'إدارة قائمة النخبة',
  execution: async ({ sock, m }) => {
    const sender = m.key.participant || m.key.remoteJid;
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text;
    const command = text?.split(' ')[0]?.substring(1);
    const mentionedUsers = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (!command) return;

    // التحقق من صلاحية العضو
    if (!eliteNumbers.includes(sender)) {
      await sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر متاح فقط لأعضاء النخبة.' });
      return;
    }

    let updatedElite = [...eliteNumbers];
    let response = '';

    try {
      switch (command) {
        case 'اضف':
          mentionedUsers.forEach(user => {
            if (!updatedElite.includes(user)) {
              updatedElite.push(user);
              response += `✔️ تم إضافة ${user.split('@')[0]} للنخبة.\n`;
            } else {
              response += `⚠️ ${user.split('@')[0]} موجود بالفعل.\n`;
            }
          });
          break;

        case 'حذف':
          mentionedUsers.forEach(user => {
            if (updatedElite.includes(user)) {
              updatedElite = updatedElite.filter(elite => elite !== user);
              response += `✔️ تم حذف ${user.split('@')[0]} من النخبة.\n`;
            } else {
              response += `⚠️ ${user.split('@')[0]} غير موجود.\n`;
            }
          });
          break;

        case 'عرض':
          response = updatedElite.length 
            ? `👑 أعضاء النخبة: ${updatedElite.map(user => user.split('@')[0]).join(', ')}`
            : '❌ لا يوجد أعضاء نخبة.';
          break;
      }

      fs.writeFileSync(eliteFilePath, `export const eliteNumbers = ${JSON.stringify(updatedElite, null, 2)};`);
      await sock.sendMessage(m.key.remoteJid, { text: response });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
};