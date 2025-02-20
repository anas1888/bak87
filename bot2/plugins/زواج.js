import { readFileSync } from 'fs';

export default {
  name: 'زواج', 
  command: ['زواج'], 
  category: 'ترفيه',
  description: 'إرسال رسالة زواج مع صورة مع الشخص العشوائي أو المحدد', 
  args: ['@mention'], // نحدد أن الأمر سيأخذ المنشن كوسيط
  execution: async ({ sock, m, args }) => {
    // جلب الأعضاء من المجموعة
    const groupMembers = await sock.groupMetadata(m.key.remoteJid);
    const members = groupMembers.participants; // قائمة الأعضاء في المجموعة

    // اختيار شخص عشوائي
    let randomMember = members[Math.floor(Math.random() * members.length)];

    // التأكد من أن الشخص العشوائي ليس نفس الشخص الذي طلب الأمر
    let mentionedUser = null;
    if (args.length > 0 && m.mentionedJid && m.mentionedJid.length > 0) {
      mentionedUser = m.mentionedJid[0]; // نحصل على المنشن الأول
    } else {
      mentionedUser = randomMember.id; // إذا لم يكن هناك منشن، نختار عشوائيًا
    }

    // اختيار شخص عشوائي آخر إذا كان الشخصين نفس الشخص
    while (mentionedUser === randomMember.id) {
      randomMember = members[Math.floor(Math.random() * members.length)];
    }

    // قراءة الصورة
    const imageBuffer = readFileSync('./1.png');  // تأكد من مسار الصورة الصحيح في جهازك

    // إنشاء نص الزواج
    const weddingMessage = `
    💍 *تم الزواج!*
    @${mentionedUser.split('@')[0]} و @${randomMember.id.split('@')[0]}، مبروك عليكم الزواج!
    نتمنى لكم حياة سعيدة ومليئة بالحب 💖
    `;

    // إرسال صورة مع النص
    await sock.sendMessage(m.key.remoteJid, {
      image: imageBuffer,
      caption: weddingMessage,  // النص مع الرسالة
      mentions: [mentionedUser, randomMember.id], // منشن للأشخاص المختارين
    });
  },
  hidden: false,
};