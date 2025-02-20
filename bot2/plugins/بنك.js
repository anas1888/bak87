import fs from 'fs';

const bankFile = './bank.json';

// تحميل البيانات
const loadBankData = () => {
    try {
        return JSON.parse(fs.readFileSync(bankFile));
    } catch (e) {
        return {}; // إنشاء ملف جديد إذا لم يكن موجودًا
    }
};

// حفظ البيانات
const saveBankData = (data) => {
    fs.writeFileSync(bankFile, JSON.stringify(data, null, 2));
};

export default {
    name: 'بنك',
    command: ['بنك'],
    category: 'ترفيه',
    description: 'إدارة حساب البنك الخاص بك.',

    execution: async ({ sock, m, args }) => {
        let user = m.key.participant.replace('@s.whatsapp.net', '').trim(); // إزالة @ عند تخزين الحساب
        const bankData = loadBankData();

        // **فتح حساب تلقائي عند استخدام "بنك"**
        if (!bankData[user]) {
            bankData[user] = { wallet: 500, bank: 0, lastClaim: 0, title: 'عضو جديد' };
            saveBankData(bankData);
        }

        const action = args[0];

        // **عرض الحساب**
        if (!action) {
            return sock.sendMessage(m.key.remoteJid, {
                text: `🏦 *حساب البنك:*\n💰 المحفظة: ${bankData[user].wallet}\n🏦 البنك: ${bankData[user].bank}\n📝 اللقب: ${bankData[user].title}`
            });
        }

        // **إيداع الأموال في البنك**
        if (action === 'ايداع') {
            const amount = parseInt(args[1]);
            if (isNaN(amount) || amount <= 0 || amount > bankData[user].wallet) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ مبلغ غير صالح أو غير متاح للإيداع!' });
            }
            bankData[user].wallet -= amount;
            bankData[user].bank += amount;
            saveBankData(bankData);
            return sock.sendMessage(m.key.remoteJid, { text: `✅ تم إيداع ${amount}💰 في حسابك البنكي!` });
        }

        // **سحب الأموال من البنك**
        if (action === 'سحب') {
            const amount = parseInt(args[1]);
            if (isNaN(amount) || amount <= 0 || amount > bankData[user].bank) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ مبلغ غير صالح أو غير متاح للسحب!' });
            }
            bankData[user].bank -= amount;
            bankData[user].wallet += amount;
            saveBankData(bankData);
            return sock.sendMessage(m.key.remoteJid, { text: `✅ تم سحب ${amount}💰 من حسابك البنكي!` });
        }

        // **تحويل الأموال إلى مستخدم آخر**
        if (action === 'تحويل') {
            if (args.length < 3) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ استخدم الصيغة الصحيحة: *بنك تحويل @رقم_المستلم المبلغ*' });
            }

            let recipient = args[1].trim().replace('@', ''); // إزالة @ عند البحث عن الحساب
            let amount = parseInt(args[2]);

            if (isNaN(amount) || amount <= 0 || amount > bankData[user].wallet) {
                return sock.sendMessage(m.key.remoteJid, { text: '❌ مبلغ غير صالح أو غير كافٍ للتحويل!' });
            }

            // **إذا كان المستلم لديه حساب، يتم التحويل**
            if (bankData[recipient]) {
                bankData[user].wallet -= amount;
                bankData[recipient].wallet += amount;
                saveBankData(bankData);
                return sock.sendMessage(m.key.remoteJid, { text: `✅ تم تحويل ${amount}💰 إلى ${args[1]} بنجاح!` });
            } else {
                return sock.sendMessage(m.key.remoteJid, { text: `❌ لا يمكن التحويل، لأن ${args[1]} ليس لديه حساب بنك!` });
            }
        }

        return sock.sendMessage(m.key.remoteJid, { text: '❌ أمر غير معروف! استخدم: *بنك [ايداع | سحب | تحويل]*' });
    },
};