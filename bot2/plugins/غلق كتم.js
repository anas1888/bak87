let isMonitoringEnabled = {};  // تخزين حالة المراقبة لكل شخص في المجموعة

export default {
  name: 'حذف_رسائل',
  command: ['اخرس', 'تنفس'],  // إضافة أمر لإيقاف الحذف
  category: 'أدوات',
  description: 'حذف رسائل الشخص الممنشن أو إيقاف حذف الرسائل.',
  execution: async ({ sock, m }) => {
    try {
      const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const groupId = m.key.remoteJid;
      const isStopCommand = m.text === 'تنفس'; // التحقق إذا كان الأمر هو "تنفس"
      
      // التأكد من أن المجموعة موجودة في البيانات
      isMonitoringEnabled[groupId] = isMonitoringEnabled[groupId] || {};

      if (isStopCommand) {
        if (mentions.length === 0) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ يرجى منشن الشخص الذي تريد إيقاف مسح رسائله.' });
        }

        const targetUser = mentions[0];

        // التحقق إذا كانت المراقبة غير مفعلة لهذا الشخص
        if (!isMonitoringEnabled[groupId][targetUser]) {
          return sock.sendMessage(m.key.remoteJid, { text: `❌ الشخص @${targetUser.split('@')[0]} ليس قيد المراقبة.` });
        }

        // إيقاف الحذف وحذف الشخص من المراقبة
        isMonitoringEnabled[groupId][targetUser] = false;

        // حذف الlistener الذي كان يراقب الرسائل
        sock.ev.removeListener('messages.upsert', handleMessagesUpsert);

        return sock.sendMessage(m.key.remoteJid, { text: `✅ تم إيقاف حذف رسائل @${targetUser.split('@')[0]} في المجموعة.` });
      }

      // التحقق إذا كان الأمر هو "حذف_رسائل"
      if (mentions.length === 0) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ يرجى منشن الشخص الذي تريد حذف رسائله.' });
      }

      const targetUser = mentions[0];

      // التحقق إذا كانت المراقبة مفعلة لهذا الشخص
      if (isMonitoringEnabled[groupId][targetUser]) {
        return sock.sendMessage(m.key.remoteJid, { text: `❌ تم بالفعل تفعيل مسح الرسائل لهذا الشخص.` });
      }

      // تفعيل مراقبة الحذف لهذا الشخص
      isMonitoringEnabled[groupId][targetUser] = true;

      // مراقبة جميع الرسائل في المجموعة وحذف رسائل الشخص المراقب
      const handleMessagesUpsert = async (chatUpdate) => {
        const messages = chatUpdate.messages;
        for (const msg of messages) {
          // تحقق إذا كانت الرسالة تخص الشخص الممنشن
          if (msg.key.remoteJid === groupId && msg.key.participant === targetUser && !msg.key.fromMe) {
            try {
              // حذف الرسالة فقط إذا كانت من الشخص المراقب
              await sock.sendMessage(groupId, { delete: msg.key });
            } catch (error) {
              console.error('⚠️ خطأ أثناء حذف الرسالة:', error);
            }
          }
        }
      };

      // ربط الحدث "upsert" بمراقبة الرسائل
      sock.ev.on('messages.upsert', handleMessagesUpsert);

      // إشعار المستخدم بتفعيل الحذف
      return sock.sendMessage(m.key.remoteJid, { 
        text: `✅ تم تفعيل حذف رسائل @${targetUser.split('@')[0]} في المجموعة.`,
        mentions: [targetUser]
      });

    } catch (error) {
      console.error('⚠️ خطأ أثناء تنفيذ أمر حذف الرسائل:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};