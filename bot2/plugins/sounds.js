import { readFileSync } from 'fs';

export default {
  name: 'إرسال صوت',
  command: ['صوت'],
  category: 'ترفيه',
  description: 'يرسل مقطع صوتي إلى المجموعة أو المحادثة.',
  args: [],
  execution: async ({ sock, m }) => {
    try {
      // مسار ملف الصوت (تأكد من وضع الملف في نفس مسار الكود)
      const audioPath = './2.opus'; // غيّر المسار حسب الملف المطلوب
      const audioBuffer = readFileSync(audioPath);

      // إرسال الصوت
      await sock.sendMessage(m.key.remoteJid, {
        audio: audioBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true, // لجعل الصوت يبدو وكأنه رسالة صوتية
      });

      console.log('تم إرسال الصوت بنجاح');
    } catch (error) {
      console.error('حدث خطأ أثناء إرسال الصوت:', error);
      await sock.sendMessage(m.key.remoteJid, { text: 'حدث خطأ أثناء إرسال الصوت 🤔.' });
    }
  },
};