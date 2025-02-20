export default {
  name: 'إيقاف البوت',
  command: ['غلق'],
  category: 'إدارة',
  description: 'يقوم بإيقاف البوت.',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      // إرسال رسالة للمستخدم
      await sock.sendMessage(m.key.remoteJid, { text: 'تم إيقاف البوت!' });
      
      // إيقاف البوت باستخدام process.exit
      console.log('إيقاف البوت...');
      process.exit(0);  // إنهاء العملية بنجاح
    } catch (error) {
      console.error('حدث خطأ أثناء محاولة إيقاف البوت:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء إيقاف البوت.' });
    }
  },
};