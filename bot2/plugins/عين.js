import fs from 'fs';
import axios from 'axios';

let timeout = 60000; // مدة السؤال (60 ثانية)
let points = 500; // عدد النقاط عند الإجابة الصحيحة

export default {
    name: 'عين',
    command: ['عين', 'عين2'], // الأوامر المستخدمة
     category: 'ترفيه',
       description: 'لعبة تخمين شخصيات الأنمي',
    execution: async ({ sock, m }) => {
        // التحقق من صحة الكائنات
        if (!sock) {
            console.error("❌ خطأ: `sock` غير معرف!");
            return;
        }
        if (!m) {
            console.error("❌ خطأ: `m` غير معرف!");
            return;
        }

        // التحقق مما إذا كان هناك سؤال قيد التشغيل
        sock.tekateki = sock.tekateki || {};
        let chatId = m.key.remoteJid;

        if (sock.tekateki[chatId]) {
            return await sock.sendMessage(chatId, { text: "❌ *هناك سؤال لم يتم الإجابة عليه بعد!*" });
        }

        try {
            // تحميل البيانات من JSON
            const url = 'https://raw.githubusercontent.com/username/dataset/main/anime.json'; // استبدل بالمسار الصحيح
            const res = await axios.get(url);

            if (res.data && Array.isArray(res.data)) {
                let data = res.data;
                let questionData = data[Math.floor(Math.random() * data.length)];

                let answer = questionData.response; // الإجابة الصحيحة
                let question = questionData.question || 'من هو هذا الشخصية؟';
                let img = questionData.image || 'https://telegra.ph/file/034daa6dcfb2270d7ff1c.jpg';
                let clue = answer.replace(/[A-Za-z]/g, '_'); // تلميح على شكل فراغات

                // نص الرسالة
                let caption = `
╮───────────────────────╭
│ ❓ *السؤال :* ${question}
│ ⏳ *الوقت :* ${(timeout / 1000).toFixed(2)} ثانية
│ 💰 *الجائزة :* ${points} نقطة
│ 🏳️ *استخدم "انسحاب" لإنهاء اللعبة*
╯───────────────────────╰ـ`.trim();

                // إرسال الصورة مع السؤال
                sock.tekateki[chatId] = [
                    await sock.sendMessage(chatId, { image: { url: img }, caption: caption }, { quoted: m }),
                    questionData, points,
                    setTimeout(async () => {
                        if (sock.tekateki[chatId]) {
                            await sock.sendMessage(chatId, { text: `⏳ *انتهى الوقت!* ❌\n✅ *الإجابة الصحيحة كانت:* ${answer}` });
                            delete sock.tekateki[chatId];
                        }
                    }, timeout)
                ];
            } else {
                console.error('❌ البيانات المستلمة ليست بتنسيق JSON صحيح.');
                await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء جلب البيانات، حاول مرة أخرى لاحقًا.' });
            }
        } catch (error) {
            console.error('❌ خطأ أثناء جلب البيانات:', error);
            await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء جلب البيانات، حاول مرة أخرى لاحقًا.' });
        }
    }
};