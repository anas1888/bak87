import { getPlugins } from '../handlers/pluginHandler.js';
import { readFileSync } from 'fs';

// قائمة ردود الفعل المخصصة لكل أمر
const commandReactions = {
  "تحديث": "🔄",
  "رفع": "📤",
  "حالة": "📌",
  "شكرا": "❤️",
  "هلا": "👋",
  "صباح الخير": "🌞",
  "مساء الخير": "🌙",
  "حبيبي": "💘",
  "تمام": "✔️",
  "وينك": "🔍",
  "هههه": "😂",
  "احبك": "😍",
};

// رقم مالك البوت
const ownerNumber = '9647817451138@s.whatsapp.net';

export default {
  name: 'أمر القائمة',
  command: ['توضيح'],
  category: 'إدارة',
  description: 'يعرض الأوامر المتاحة لكل قسم مع صورة ويتفاعل تلقائيًا مع الأوامر.',
  
  execution: async ({ sock, m, prefix }) => {
    try {
      // إرسال تفاعل على الأمر "تحديث"
      await sock.sendMessage(m.key.remoteJid, { react: { text: "👑", key: m.key } });

      // جلب جميع الأوامر المصنفة
      const plugins = getPlugins();
      const categories = {};

      plugins.forEach((plugin) => {
        if (!plugin.category) return;
        if (!categories[plugin.category]) {
          categories[plugin.category] = [];
        }
        categories[plugin.category].push(plugin.command[0]); // حفظ اسم الأمر فقط
      });

      // إنشاء قائمة الأقسام
      let menu = `📌 *اختر قسم الأوامر:*\n`;
      let categoryIndex = 1;
      const categoryKeys = Object.keys(categories);

      categoryKeys.forEach((category) => {
        menu += `${categoryIndex}️⃣ ${category}\n`;
        categoryIndex++;
      });

      menu += `\n🔹 *أرسل رقم القسم مع البريفكس (${prefix}1، ${prefix}2...) لعرض أوامره.*`;

      // إرسال القائمة
      await sock.sendMessage(m.key.remoteJid, { text: menu });

      // انتظار رد المستخدم لاختيار القسم
      sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid !== m.key.remoteJid) return;

        let userResponse = msg.message.conversation?.trim();
        if (!userResponse || !userResponse.startsWith(prefix)) return;

        userResponse = userResponse.replace(prefix, '').trim();
        if (!/^\d+$/.test(userResponse)) return;

        const selectedIndex = parseInt(userResponse) - 1;
        if (selectedIndex < 0 || selectedIndex >= categoryKeys.length) return;

        const selectedCategory = categoryKeys[selectedIndex];
        let response = `☠️ *${selectedCategory}* ☠️\n\n`;

        categories[selectedCategory].forEach((command) => {
          response += `☠️ *${command}*\n`;
        });

        // تحميل صورة القسم
        const imagePath = `./images/${selectedCategory}.png`;
        let imageBuffer;
        try {
          imageBuffer = readFileSync(imagePath);
        } catch (err) {
          console.error(`⚠️ لم يتم العثور على صورة للقسم: ${selectedCategory}`);
        }

        // إرسال الصورة مع القائمة
        if (imageBuffer) {
          await sock.sendMessage(m.key.remoteJid, { image: imageBuffer, caption: response });
        } else {
          await sock.sendMessage(m.key.remoteJid, { text: response });
        }
      });

      // **تفاعل تلقائي مع الأوامر**
      sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message.message || !message.key.participant) return;
        
        // السماح فقط برسائل المالك
        if (message.key.participant !== ownerNumber) return;

        const text = message.message.conversation?.trim();
        if (!text) return;

        // إذا كان النص أحد الأوامر في القائمة، ضع التفاعل المناسب
        if (commandReactions[text]) {
          await sock.sendMessage(message.key.remoteJid, { react: { text: commandReactions[text], key: message.key } });
        }
      });

    } catch (error) {
      console.error('❌ خطأ في أمر القائمة:', error);
      await sock.sendMessage(m.key.remoteJid, {
        text: `⚠️ حدث خطأ أثناء عرض القائمة:\n\n*${error.message}*`,
      });
    }
  },
  hidden: false,
};