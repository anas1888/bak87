import { getPlugins } from './pluginHandler.js';
import { updateDatabase } from '../utils/database.js';
import { inspect } from 'util';
import { updateXP } from '../plugins/مستوى.js'; // ✅ إضافة تحديث المستوى
import fs from 'fs';

const bankFile = './bank.json';

// تحميل بيانات البنك
const loadBankData = () => {
    try {
        return JSON.parse(fs.readFileSync(bankFile));
    } catch (e) {
        return {};
    }
};

// حفظ بيانات البنك
const saveBankData = (data) => {
    fs.writeFileSync(bankFile, JSON.stringify(data, null, 2));
};

// إضافة مال عشوائي عند التفاعل مع أوامر ترفيه
const rewardMoneyForInteraction = (user, bankData) => {
    const rewardAmount = Math.floor(Math.random() * 50) + 10; // مبلغ عشوائي بين 10 إلى 50
    bankData[user].wallet += rewardAmount;
    saveBankData(bankData);
    // لا يتم إرسال رسالة المكافأة بعد الآن
};

export const handleCommand = (text, m, sock, prefix, sleep) => {
  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const plugins = getPlugins();

  for (const plugin of plugins) {
    if (plugin.hidden) continue;

    if (plugin.command.includes(command)) {
      plugin.execution({ sock, m, args, prefix, sleep });

      // ✅ تحقق إذا كان القسم "ترفيه" وتفاعل مع أوامر ترفيه
      if (plugin.category === "ترفيه") {
        // إضافة تحديث XP هنا
        const user = m.key.participant 
    ? m.key.participant.replace('@s.whatsapp.net', '') 
    : m.key.remoteJid.replace('@s.whatsapp.net', '');
        updateXP(user, "ترفيه", sock, m.key.remoteJid);

        // إضافة مال للمستخدم عند التفاعل مع أوامر ترفيه
        const bankData = loadBankData();

        if (!bankData[user]) {
          bankData[user] = { wallet: 500, bank: 0 }; // فتح حساب للمستخدم إذا لم يكن لديه حساب
        }

        rewardMoneyForInteraction(user, bankData);
        // لم يتم إرسال رسالة المكافأة
      }
      break;
    }
  }
};

export const handleEvalCommand = (code, m, sock, eventEmitter) => {
  try {
    let result = eval(code);
    if (result instanceof Promise) {
      result.then(res => {
        sock.sendMessage(m.key.remoteJid, { text: inspect(res) });
      }).catch(err => {
        sock.sendMessage(m.key.remoteJid, { text: inspect(err) });
      });
    } else {
      sock.sendMessage(m.key.remoteJid, { text: inspect(result) });
    }
  } catch (err) {
    sock.sendMessage(m.key.remoteJid, { text: inspect(err) });
  }
};