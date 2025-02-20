export default {
  name: 'سبام بدون تأخير',
  command: ['سبام'],
  category: 'إدارة',
  description: 'إرسال 1000 رسالة مختلفة دفعة واحدة',
  args: [],
  execution: async ({ sock, m }) => {
    const messages = [];

    // إنشاء 1000 رسالة مختلفة
    for (let i = 1; i <= 100000; i++) {
      messages.push(`هذه هي الرسالة رقم ${i}`);
    }

    // إرسال الرسائل بدون تأخير
    for (let i = 0; i < messages.length; i++) {
      await sock.sendMessage(m.key.remoteJid, { text: messages[i] });
    }

    await sock.sendMessage(m.key.remoteJid, {
      text: '*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*\n\n✅ تم إرسال 1000 رسالة مختلفة دفعة واحدة!\n\n*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*',
    });
  },
  hidden: false,
};