import { parsePhoneNumberFromString } from 'libphonenumber-js';
import fs from 'fs'; // للوصول إلى الملفات المحلية

export default {
  name: 'إحصائيات المجموعة',
  command: ['احصاء'],
  category: 'كروب',
  description: 'يعرض إحصائيات تفصيلية حول أعضاء المجموعة بما في ذلك الدولة.',
  args: [],
  execution: async ({ sock, m }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    try {
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
      const groupSize = participants.length;
      const adminSize = admins.length;
      const groupName = groupMetadata.subject;
      const creationTime = new Date(groupMetadata.creation * 1000).toLocaleString(); // تاريخ إنشاء المجموعة

      // استرداد الدولة من خلال رقم هاتف الأعضاء
      const countries = [];
      for (const participant of participants) {
        const phoneNumber = participant.id.split('@')[0];
        const parsedNumber = parsePhoneNumberFromString(phoneNumber);
        if (parsedNumber) {
          const country = parsedNumber.country;
          countries.push(country);
        }
      }

      // الحصول على الدولة الأكثر تكرارًا في المجموعة
      const mostCommonCountry = countries.sort((a, b) =>
        countries.filter(v => v === a).length - countries.filter(v => v === b).length
      ).pop();

      // إعداد النص للإحصائيات
      const statsText = `
*إحصائيات المجموعة:*
- اسم المجموعة: ${groupName}
- عدد الأعضاء: ${groupSize}
- عدد المشرفين: ${adminSize}
- تاريخ إنشاء المجموعة: ${creationTime}
- الدولة الأكثر تواجدًا في المجموعة: ${mostCommonCountry || 'غير متاح'}
      `;

      // قراءة الفيديو من الملف المحلي
      const videoPath = './2.mp4'; // قم بتحديد المسار الصحيح للفيديو على جهازك
      const videoBuffer = fs.readFileSync(videoPath); // قراءة الفيديو في Buffer

      // إرسال الفيديو مع النص
      await sock.sendMessage(m.key.remoteJid, {
        video: videoBuffer, // إرسال الفيديو من الـ Buffer
        caption: statsText,
        mentions: participants.map(p => p.id)
      });
    } catch (error) {
      console.error('حدث خطأ أثناء جلب إحصائيات المجموعة:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء جلب إحصائيات المجموعة.' });
    }
  }, // تم إضافة الفاصلة المنقوطة هنا لإغلاق الدالة
};