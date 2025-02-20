import { getPlugins } from '../handlers/pluginHandler.js';
import { inlineCode } from '../helper/formatted.js';
import { readFileSync } from 'fs';

export default {
  name: 'شرح الأوامر',
  command: ['شرح'],
  category: 'إدارة',
  description: 'يعرض شرحًا مفصلاً لكل أمر متاح',
  args: [],
  execution: ({ sock, m, args, prefix, sleep }) => {
    const plugins = getPlugins();
    let menu = `_*شرح الأوامر المتاحة*_\n\n`;

    plugins.forEach((plugin) => {
      if (plugin.hidden) return;

      // إضافة فئة الأمر
      menu += `*❀ فئة: ${plugin.category || 'غير مصنف'}*\n`;

      // إضافة اسم الأمر
      menu += `*🔸 الأمر*: ${plugin.command.map(cmd => inlineCode(cmd)).join(', ')}\n`;

      // إضافة الوصف
      menu += `*📖 الوصف*: ${plugin.description || 'لا يوجد وصف'}\n`;

      // إضافة الوسائط (args) إذا كانت موجودة
      if (plugin.args && Array.isArray(plugin.args) && plugin.args.length > 0) {
        menu += `*📝 الوسائط*: ${plugin.args.join(' / ')}\n`;
      } else {
        menu += `*📝 الوسائط*: لا يوجد وسائط.\n`;
      }

      menu += `\n*༺❯════⊰👑⊱════❮༻*\n`;
    });

    // قراءة الصورة
    const imageBuffer = readFileSync('./3.png');

    // إرسال الصورة مع النص
    sock.sendMessage(m.key.remoteJid, {
      image: imageBuffer,
      caption: menu,
    });
  },
  hidden: false,
};