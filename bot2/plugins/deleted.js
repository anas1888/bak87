import fs from 'fs';
import path from 'path';

export default {
  name: 'deletePlugin',
  command: ['حذف_امر'],
  category: 'إدارة',
  description: 'حذف أمر بلجن بناءً على الاسم',
  execution: async ({ sock, m }) => {
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text;
    const parts = text.trim().split(' ');

    if (parts.length < 2) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '❌ يرجى تحديد اسم البلجن لحذفه. مثال: حذف جديد',
      });
    }

    const pluginName = parts[1].trim();
    const pluginFilePath = path.resolve(`./plugins/${pluginName}.js`);

    try {
      if (!fs.existsSync(pluginFilePath)) {
        return await sock.sendMessage(m.key.remoteJid, {
          text: `❌ لا يوجد بلجن بالاسم: ${pluginName}`,
        });
      }

      fs.unlinkSync(pluginFilePath);
      await sock.sendMessage(m.key.remoteJid, {
        text: `✔️ تم حذف البلجن: ${pluginName}`,
      });

    } catch (error) {
      console.error('خطأ أثناء حذف البلجن:', error);
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ حدث خطأ أثناء حذف البلجن.',
      });
    }
  },
};