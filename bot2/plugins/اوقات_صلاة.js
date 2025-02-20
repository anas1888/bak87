import axios from 'axios';

export default {
  name: 'أوقات الصلاة',
  command: ['الصلاة'],
  category: 'دين',
  description: 'يعرض مواقيت الصلاة لمدينة معينة.',
  args: ['اسم المدينة'],
  execution: async ({ sock, m, args }) => {
    try {
      if (!args.length) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ *يرجى إدخال اسم المدينة بعد الأمر!*\n\n✅ *مثال:* `الصلاة القاهرة`' }, { quoted: m });
      }

      const city = args.join(' ');
      const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=EG`;

      const response = await axios.get(apiUrl);
      const timings = response.data.data.timings;

      if (!timings) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ لم أتمكن من العثور على مواقيت الصلاة لهذه المدينة.' }, { quoted: m });
      }

      // تحويل التوقيت إلى 12 ساعة
      function format12HourTime(time24) {
        const [hours, minutes] = time24.split(':');
        let period = 'AM';
        let hours12 = parseInt(hours, 10);

        if (hours12 >= 12) {
          period = 'PM';
          if (hours12 > 12) hours12 -= 12;
        }

        return `${hours12}:${minutes} ${period}`;
      }

      // تحضير رسالة الأوقات
      const prayerMessage = `
📍 *مواقيت الصلاة في ${city} اليوم* 🕌

- 🌅 الفجر: *${format12HourTime(timings.Fajr)}*
- 🌄 الشروق: *${format12HourTime(timings.Sunrise)}*
- ☀️ الظهر: *${format12HourTime(timings.Dhuhr)}*
- ⛅ العصر: *${format12HourTime(timings.Asr)}*
- 🌆 المغرب: *${format12HourTime(timings.Maghrib)}*
- 🌙 العشاء: *${format12HourTime(timings.Isha)}*

🤲 *نسأل الله القبول والطاعة!* ✨
      `;

      await sock.sendMessage(m.key.remoteJid, { text: prayerMessage }, { quoted: m });

    } catch (error) {
      console.error('❌ خطأ في جلب مواقيت الصلاة:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء جلب مواقيت الصلاة، حاول مرة أخرى لاحقًا.' }, { quoted: m });
    }
  },
};