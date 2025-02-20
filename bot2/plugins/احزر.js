export default {
    name: 'توقعات',
    command: ['تخمين'],
    category: 'ترفيه',
    description: 'يعطيك توقعًا عشوائيًا عن مستقبلك مع نسبة مئوية 🔮',
    args: [],
    execution: async ({ sock, m }) => {
        const predictions = [
            "📊 *مستوى ذكائك:*",
            "💍 *فرصة زواجك قريبًا:*",
            "✈️ *فرصة سفرك قريبًا:*",
            "💰 *فرصة أن تصبح غنيًا:*",
            "🎯 *فرصة تحقيقك للنجاح:*",
            "🚀 *فرصة تحقيق حلمك:*",
            "🎉 *فرصة حصولك على مفاجأة:*",
            "🔮 *فرصة سماعك أخبارًا رائعة:*",
            "📈 *فرصة تحسن حياتك المالية:*",
            "💡 *فرصة اكتشافك موهبة جديدة:*"
        ];

        let randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        let percentage = Math.floor(Math.random() * 100) + 1; // نسبة عشوائية بين 1 و 100

        await sock.sendMessage(m.key.remoteJid, { text: `🔮 ${randomPrediction} *${percentage}%*` });
    }
};