import fs from 'fs';
import path from 'path';

export default {
  name: 'عين',
  command: ['3عين'],
  category: 'أدوات',
  description: 'بدء فعالية عين وإرسال صورة مع تلميح.',
  args: [],
  execution: async ({ sock, m }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) return;

    const userWhoSent = m.key.participant;
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';


    const images = [
      { file: 'eye1.jpg', answer: 'شانكس' },
      { file: 'eye2.jpg', answer: 'زورو' },
      { file: 'eye3.jpg', answer: 'لوفي' },
      { file: 'eye4.jpg', answer: 'نامي' },
      { file: 'eye5.jpg', answer: 'سانجي' },
      { file: 'eye6.jpg', answer: 'ميكو' },
      { file: 'eye7.jpg', answer: 'ليليث' },
      { file: 'eye8.jpg', answer: 'ناغي' },
      { file: 'eye9.jpg', answer: 'كاناو' },
      { file: 'eye10.jpg', answer: 'غوجو' },
      { file: 'eye11.jpg', answer: 'سوكونا' },
      { file: 'eye12.jpg', answer: 'باتشيرا' },
      { file: 'eye13.jpg', answer: 'نيزوكو' }
    ];

    // اختيار صورة عشوائية
    const selected = images[Math.floor(Math.random() * images.length)];
    const imagePath = `./media/${selected.file}`;
    
    if (!fs.existsSync(imagePath)) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ لم يتم العثور على صورة العين! تأكد من رفعها داخل مجلد media.' }, { quoted: m });
    }

    const caption = `فــعــالـيـه عـيـن \n--------------------->\nالوقت ⟣ ⌊45.00⌉\n--------------------->\nالجائزة ⟣ ⌊10000⌉\n--------------------->\nالنوع: عين شخصيه عشوائيه\n> استخدم .تلميح للجواب`;

    const imageBuffer = fs.readFileSync(imagePath);
    await sock.sendMessage(m.key.remoteJid, { image: imageBuffer, caption: caption });

    let answered = false;
    const timeout = setTimeout(async () => {
      if (!answered) {
        await sock.sendMessage(m.key.remoteJid, { text: `⌯ انتهى الوقت\nالإجابة: ${selected.answer}` });
      }
    }, 45000);

    const handleMessage = async ({ messages }) => {
      const msg = messages[0];
      if (!msg.message || msg.key.remoteJid !== m.key.remoteJid) return;
      if (msg.key.participant === botNumber) return;
      if (msg.key.participant !== userWhoSent) return;

      const userAnswer = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim().toLowerCase();

      if (userAnswer.includes(selected.answer.toLowerCase())) {
        answered = true;
        clearTimeout(timeout);

        await sock.sendMessage(m.key.remoteJid, { text: `❐┃اجـابـة صـحـيـحـة┃✅ ❯\n\n❐↞┇الـجـائـزة💰↞10000 نقطه` }, { quoted: msg });
        sock.ev.off('messages.upsert', handleMessage);
      } else {
        await sock.sendMessage(m.key.remoteJid, { text: "❐┃اجـابـة خـاطـئـة┃❌ ❯" }, { quoted: msg });
      }
    };

    sock.ev.on('messages.upsert', handleMessage);
  },
};