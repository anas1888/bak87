import { eliteNumbers } from '../elite.js'; // استيراد قائمة النخبة

const botPrefixes = ['!', '/', '.']; // دعم جميع البادئات الممكنة

const emojiMap = {
  '.رفع': '📤',
  '.مساعدة': '📜',
  '.حالة': '⚡',
  '.اكس_بوت': '🎮',
  '.ترجمة': '🌍',
  '.معلومة': '📚',
  '/start': '🚀',
  '/stop': '🛑'
};

export default {
  name: 'تفاعل بعد الأوامر',
  command: Object.keys(emojiMap),
  category: 'إدارة',
  description: 'يضع إيموجي على أوامر البوت فقط إذا أرسلها شخص من النخبة.',
  execution: async ({ sock }) => {
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const message = messages[0];
      if (!message || !message.message) return;

      const sender = message.key.participant || message.key.remoteJid;
      const text = message.message?.conversation?.trim() || '';

      if (!eliteNumbers.includes(sender)) return; // التحقق مما إذا كان المرسل من النخبة

      console.log(`📩 استقبلت رسالة من النخبة: ${text}`);

      if (botPrefixes.some(prefix => text.startsWith(prefix))) {
        const command = text.split(' ')[0].trim();

        if (emojiMap[command]) {
          console.log(`✅ أمر مطابق من النخبة: ${command}`);

          await sock.sendMessage(message.key.remoteJid, {
            react: { text: emojiMap[command], key: message.key }
          });
        }
      }
    });
  },
};