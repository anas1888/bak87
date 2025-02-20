import { readFileSync } from 'fs'; // استيراد الوحدة المطلوبة لقراءة الملفات
import { eliteNumbers } from '../elite.js'; // استيراد قائمة أرقام النخبة

export default {
  name: 'ترحيب', 
  command: ['ترحيب'], 
  category: 'كروب',
  description: 'إرسال رسالة ترحيب مع اللقب والمنشن عند كتابة الأمر "ترحيب" متبوعًا بالمنشن واللقب', 
  args: ['@mention', 'لقب'], // تحديد الوسيطين المطلوبين
  execution: async ({ sock, m, args }) => {
    try {
      const sender = m.key.participant || m.participant; // استخراج رقم المرسل

      // **التحقق مما إذا كان المستخدم من النخبة**
      if (!eliteNumbers.includes(sender)) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر متاح فقط لأعضاء النخبة.' });
      }

      let mentionedUser = null;
      const title = args[1]; // اللقب

      // تحقق إذا كانت الرسالة تحتوي على نص
      let messageText = m.message?.conversation || m.message?.extendedTextMessage?.text;

      if (messageText) {
        // تحقق إذا كانت الرسالة تحتوي على رسالة مقتبسة (رسالة سابقة)
        if (m.quotedMessage) {
          const quotedMessage = m.quotedMessage;

          // استخدام contextInfo لاستخراج المنشن
          if (quotedMessage.contextInfo?.mentionedJid && quotedMessage.contextInfo?.mentionedJid.length > 0) {
            mentionedUser = quotedMessage.contextInfo.mentionedJid[0]; // نأخذ أول منشن
          }
        } else {
          // البحث عن المنشن في النص الحالي
          if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid && m.message?.extendedTextMessage?.contextInfo?.mentionedJid.length > 0) {
            mentionedUser = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
          }
        }

        // التأكد من وجود منشن صحيح
        if (!mentionedUser) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ يرجى تضمين المنشن في الرسالة بشكل صحيح.' });
        }

        // التأكد من أن اللقب موجود
        if (!title) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ يرجى تضمين اللقب بعد المنشن.' });
        }

        // تنظيف المنشن وإزالة الرموز غير الضرورية
        const cleanedMention = mentionedUser.replace(/[^\w@+.-]/g, '');
        const userId = cleanedMention.split('@')[0]; // استخراج الرقم من المنشن

        // رسالة الترحيب
        const welcomeMessage = `
*✥━━━✥• ☯︎ ~┋❮🌹❯┋~ ☯︎ •✥━━━✥*

*نعطر طريقك ♡ بأجمل باقات الورد والياسمين نستقبلك وأجمل عبارات ترحيب نهديك أسعدنا وجودك معنا🤍✨♥️* 

 ~*☆ اللقــ👤ــب:*~ 
> *『 ${title} 』*
~*☆ منشــ📧ــن:*~ 
> *『 @${userId} 』*

*• نــرجــو مــنــك دخــ💯ــول رابــط الاعــ🗞️ــلانات✨*

https://chat.whatsapp.com/IAC6qu5azV4D8GRoB2aO5M

*✥━━━✥• ☯︎ ~┋❮🌹❯┋~ ☯︎ •✥━━━✥*
𝐵𝑜𝑡𝑒𓂃𝑧𝑎𝑐𝑘
        `;

        // قراءة صورة الترحيب
        const imageBuffer = readFileSync('./3.png');

        // إرسال الصورة مع النص والرسالة مع تضمين المنشن
        sock.sendMessage(m.key.remoteJid, {
          image: imageBuffer,
          caption: welcomeMessage,
          contextInfo: { mentionedJid: [mentionedUser] }
        });

      } else {
        sock.sendMessage(m.key.remoteJid, { text: '❌ الرجاء إرسال النص بشكل صحيح مع الأمر' });
      }
    } catch (error) {
      console.error('⚠️ خطأ أثناء تنفيذ أمر الترحيب:', error);
      sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};