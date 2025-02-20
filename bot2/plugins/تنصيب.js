// دالة لتوليد كود عشوائي مكون من 8 أرقام وحروف كبيرة
function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export default {
  name: 'تنصيب',  // اسم الأمر
  command: ['تنصيب'],  // يمكن استدعاؤه بالطريقة التقليدية أيضًا
  category: 'ترفيه',
  description: 'إرسال كود تنصيب مكون من 8 أرقام وحروف كبيرة.',
  execution: async ({ sock, m }) => {
    try {
      // استخراج نص الرسالة
      const messageText = m.message?.conversation?.trim() || '';

      // التأكد أن الرسالة تحتوي على كلمة "تنصيب" دون الحاجة إلى بريفكس
      if (messageText.includes('تنصيب')) {
        // توليد الكود العشوائي
        const installationCode = generateRandomCode();

        // إرسال الكود للمستخدم
        await sock.sendMessage(m.key.remoteJid, {
          text: ` ${installationCode}`,
        });
      }

    } catch (error) {
      console.error('⚠️ خطأ أثناء تنفيذ أمر التنصيب:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};