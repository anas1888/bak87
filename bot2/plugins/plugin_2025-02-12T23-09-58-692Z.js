export default {
  name: 'إصلاح الاتصال',
  command: ['اتصال'],
  category: 'مطوير',
  description: 'يمنع توقف البوت ويعيد تشغيله تلقائيًا عند حدوث مشكلة',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
          if (shouldReconnect) {
            startBot(); // إعادة تشغيل البوت تلقائيًا
          }
        } else if (connection === 'open') {
          console.log('✅ تم الاتصال بواتساب بنجاح');
        }
      });

      // إبقاء البوت متصلاً
      setInterval(() => {
        sock.sendPresenceUpdate('available');
      }, 10000); // تحديث الحالة كل 10 ثوانٍ

      await sock.sendMessage(m.key.remoteJid, { text: "✅ تم تفعيل الحماية من التوقف التلقائي!" });
    } catch (error) {
      console.error('❌ خطأ في إصلاح الاتصال:', error);
      await sock.sendMessage(m.key.remoteJid, { text: `⚠️ حدث خطأ أثناء تنفيذ الأمر:\n\n*${error.message}*` });
    }
  },
  hidden: false,
};