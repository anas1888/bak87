import fs from 'fs';
import path from 'path';

export default {
  name: 'dynamicPluginAdder',
  command: ['جديد'],
  category: 'إدارة',
   description: 'إضافة أوامر جديدة للبوت عند منشن الرسالة وإنشاء اسم ملف تلقائيًا.',
  execution: async ({ sock, m }) => {
    const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // التحقق من وجود رسالة مشار إليها
    if (!quotedMessage || !quotedMessage.conversation) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '❌ يرجى منشن الرسالة التي تحتوي على الكود بعد كتابة "جديد".',
      });
    }

    const pluginCode = quotedMessage.conversation.trim();
    if (!pluginCode) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: '❌ لم يتم تقديم أي كود لإضافته كأمر للبوت.',
      });
    }

    // توليد اسم ملف فريد باستخدام الوقت الحالي
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pluginFileName = `plugin_${timestamp}.js`;
    const pluginFilePath = path.resolve(`./plugins/${pluginFileName}`);

    try {
      // كتابة الكود في ملف جديد
      fs.writeFileSync(pluginFilePath, pluginCode);

      await sock.sendMessage(m.key.remoteJid, {
        text: `✔️ تم إنشاء البلجن وحفظه في: ${pluginFileName}`,
      });

    } catch (error) {
      console.error('خطأ أثناء كتابة البلجن:', error);
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ حدث خطأ أثناء حفظ البلجن.',
      });
    }
  },
};