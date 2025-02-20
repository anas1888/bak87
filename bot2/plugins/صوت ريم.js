import { readFileSync } from 'fs'; // استيراد الوحدة المطلوبة لقراءة الملفات

export default {
  name: 'إرسال صوت',
  command: ['••'],
  category: 'أدوات',
  description: 'يرسل مقطع صوتي عشوائي من الملفات الموجودة في مجلد البوت.',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      // حالياً يوجد فقط صوتان، ويمكنك إضافة المزيد لاحقاً
      const audioFiles = [
        '1.opus',
        '2.opus',
      ]; 

      // التأكد من وجود ملفات صوتية
      if (audioFiles.length === 0) {
        await sock.sendMessage(m.key.remoteJid, { text: '❌ لا توجد ملفات صوتية متاحة.' });
        return;
      }

      // اختيار ملف عشوائي من القائمة
      const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];

      // إرسال الملف الصوتي
      await sock.sendMessage(m.key.remoteJid, {
        audio: { url: `./${randomAudio}` }, // الملف موجود داخل مجلد البوت
        mimetype: 'audio/mpeg', // نوع الملف الصوتي
        ptt: false, // true إذا كنت تريد إرساله كرسالة صوتية
      });

      // إرسال ملصق مع الصوت
      await sock.sendMessage(m.key.remoteJid, {
        sticker: { url: './stickers/1.webp' } // إرسال الملصق باستخدام URL
      });

      console.log(`✅ تم إرسال الصوت: ${randomAudio} مع الملصق`);
    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء إرسال الصوت أو الملصق:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء إرسال الصوت أو الملصق.' });
    }
  },
};