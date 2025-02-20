import fs from 'fs';

const levelsFile = './levels.json';
const bankFile = './bank.json';

// تحميل بيانات المستويات
const loadLevelsData = () => {
    try {
        return JSON.parse(fs.readFileSync(levelsFile));
    } catch (e) {
        return {};
    }
};

// حفظ بيانات المستويات
const saveLevelsData = (data) => {
    fs.writeFileSync(levelsFile, JSON.stringify(data, null, 2));
};

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

// حساب النقاط المطلوبة لكل مستوى
const calculateRequiredXP = (level) => 100 + level * 50;

// قائمة المكافآت لكل مستوى
const levelRewards = {
    5: 1000,
    10: 5000,
    20: 10000
};

// تحديث XP فقط عند استخدام أوامر "ترفيه"
export const updateXP = async (user, commandCategory, sock, remoteJid) => {
    if (commandCategory !== "ترفيه") return; // إضافة XP فقط لأوامر الترفيه

    const levelsData = loadLevelsData();
    const bankData = loadBankData();

    if (!levelsData[user]) {
        levelsData[user] = { xp: 0, level: 1, title: '', receivedRewards: [] };
    }

    if (!bankData[user]) {
        bankData[user] = { wallet: 500, bank: 0 };
    }

    // **إضافة XP عشوائي عند التفاعل**
    const addXP = Math.floor(Math.random() * 20) + 10;
    levelsData[user].xp += addXP;

    let levelUpMessage = "";

    // **التحقق من الترقية إلى مستوى جديد**
    while (levelsData[user].xp >= calculateRequiredXP(levelsData[user].level)) {
        if (levelsData[user] && levelsData[user].level !== undefined) {
    levelUpMessage += `🎉 تهانينا! لقد وصلت إلى *المستوى ${levelsData[user].level}*!\n`;
} else {
    // التعامل مع الحالة إذا كانت البيانات مفقودة
    levelUpMessage += "❌ هناك مشكلة في الحصول على بيانات المستوى. يرجى المحاولة لاحقًا.\n";
}

        // **التحقق من المكافآت**
        if (levelRewards[levelsData[user].level] && !levelsData[user].receivedRewards.includes(levelsData[user].level)) {
            levelsData[user].receivedRewards.push(levelsData[user].level);
            bankData[user].wallet += levelRewards[levelsData[user].level];
            levelUpMessage += `🎁 مكافأة! حصلت على ${levelRewards[levelsData[user].level]}💰!\n`;
        }
    }

    // **حفظ التحديثات**
    saveLevelsData(levelsData);
    saveBankData(bankData);

    if (levelUpMessage) {
        return sock.sendMessage(remoteJid, { text: levelUpMessage });
    }
};

// **أمر مستوى**
export default {
    name: 'مستوى',
    command: ['لفل'],
    category: 'ترفيه',
    description: 'عرض مستواك أو ترتيب اللاعبين أو تسجيل لقب',

    execution: async ({ sock, m, args }) => {
        const user = m.key.participant.replace('@s.whatsapp.net', '');
        const levelsData = loadLevelsData();

        if (!levelsData[user]) {
            levelsData[user] = { xp: 0, level: 1, title: '', receivedRewards: [] };
        }

        const action = args[0];

        // **عرض المستوى الشخصي**
        if (!action) {
            const title = levelsData[user].title ? `🏷️ *${levelsData[user].title}*` : '';
            return sock.sendMessage(m.key.remoteJid, { text: `🎖️ *مستواك الحالي:*\n📊 المستوى: ${levelsData[user].level}\n✨ XP: ${levelsData[user].xp}/${calculateRequiredXP(levelsData[user].level)}\n${title}` });
        }

        // **عرض ترتيب المستخدمين عند كتابة "مستوى ترتيب"**
        if (action === 'ترتيب') {
            const sortedUsers = Object.entries(levelsData)
                .sort((a, b) => b[1].level - a[1].level || b[1].xp - a[1].xp)
                .slice(0, 10);

            let rankingList = [];

            for (let i = 0; i < sortedUsers.length; i++) {
                const [user, data] = sortedUsers[i];
                rankingList.push(`${i + 1}️⃣ *${user}*\n📊 المستوى: ${data.level}\n✨ XP: ${data.xp}/${calculateRequiredXP(data.level)}\n`);
            }

            const rankingMessage = `🏆 *ترتيب المستخدمين حسب المستوى:*\n\n${rankingList.join("\n")}`;
            return sock.sendMessage(m.key.remoteJid, { text: rankingMessage });
        }

        // **تسجيل اللقب عند كتابة "مستوى تسجيل لقبي [اللقب]"**
        if (action === 'تسجيل' && args[1] === 'لقبي') {
            const title = args.slice(2).join(' ');
            if (!title) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ يجب عليك إدخال لقب بعد الأمر، مثال:\n\n*مستوى تسجيل لقبي الملك 👑*' });
            }

            levelsData[user].title = title;
            saveLevelsData(levelsData);

            return sock.sendMessage(m.key.remoteJid, { text: `✅ تم تسجيل لقبك الجديد: *${title}*` });
        }

        // **تحويل نقاط XP إلى شخص آخر**
        if (action === 'تحويل' && args[1] && args[2]) {
            const target = args[1].replace('@', '').replace('s.whatsapp.net', ''); // إزالة البادئة
            const amount = parseInt(args[2]);

            if (!levelsData[target]) {
                return sock.sendMessage(m.key.remoteJid, { text: `❌ الشخص المرسل إليه [${target}] ليس لديه حساب مستويات!` });
            }

            if (isNaN(amount) || amount <= 0 || amount > levelsData[user].xp) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ لا يمكنك تحويل هذه الكمية من XP!' });
            }

            // خصم الـ XP من المستخدم المرسل
            levelsData[user].xp -= amount;
            // إضافة الـ XP للمستقبل
            levelsData[target].xp += amount;

            // التحقق إذا كان الشخص المستقبل قد ترقى بعد التحويل
            let levelUpMessage = '';
            while (levelsData[target].xp >= calculateRequiredXP(levelsData[target].level)) {
                levelsData[target].xp -= calculateRequiredXP(levelsData[target].level);
                levelsData[target].level++;
                levelUpMessage += `🎉 تهانينا! لقد وصلت إلى *المستوى ${levelsData[target].level}*!\n`;

                // **التحقق من المكافآت**
                if (levelRewards[levelsData[target].level] && !levelsData[target].receivedRewards.includes(levelsData[target].level)) {
                    levelsData[target].receivedRewards.push(levelsData[target].level);
                    levelUpMessage += `🎁 مكافأة! حصلت على ${levelRewards[levelsData[target].level]}💰!\n`;
                }
            }

            // **إعادة حساب مستوى الشخص المرسل بناءً على XP المتبقي**
            while (levelsData[user].xp < calculateRequiredXP(levelsData[user].level) && levelsData[user].level > 1) {
                levelsData[user].level--;
            }

            // حفظ التحديثات
            saveLevelsData(levelsData);

            if (levelUpMessage) {
                sock.sendMessage(m.key.remoteJid, { text: levelUpMessage });
            }

            return sock.sendMessage(m.key.remoteJid, { text: `✅ تم تحويل ${amount} XP إلى [${target}]` });
        }
    }
};