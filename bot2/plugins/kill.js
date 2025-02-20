export default {
  name: 'قتل', 
  command: ['قتل'], 
  category: 'ترفيه',
  description: 'اختيار شخص عشوائي من المجموعة وجعلهم "يُقتلون" أو "ينامون" في اللعبة', 
  args: [], // لا نحتاج لأي وسيط من المستخدم
  execution: async ({ sock, m }) => {
    // جلب أعضاء المجموعة
    const groupMembers = await sock.groupMetadata(m.key.remoteJid);
    const members = groupMembers.participants; // قائمة الأعضاء في المجموعة

    // اختيار عضو عشوائي من المجموعة
    const randomMember = members[Math.floor(Math.random() * members.length)];

    // التأكد من عدم اختيار البوت نفسه
    if (randomMember.id === sock.user.id) {
      return sock.sendMessage(m.key.remoteJid, { text: 'لا أستطيع اختيار نفسي!' });
    }

    // إنشاء رسالة "القتل" أو "النوم" العشوائية
    const message = `
    😱 *تم قتل الشخص التالي*: 
    @${randomMember.id.split('@')[0]} 💀
    حظًا أفضل في المرة القادمة!
    `;

    // إرسال الرسالة مع المنشن للشخص المختار
    await sock.sendMessage(m.key.remoteJid, { 
      text: message, 
      mentions: [randomMember.id]
    });
  },
  hidden: false,
};