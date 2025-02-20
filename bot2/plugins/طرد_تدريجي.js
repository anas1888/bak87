import { eliteNumbers } from '../elite.js'; // استيراد قائمة النخبة

export default {
    name: "زرف_بالتدريج",
    command: ["تعذيب"],
    category: "زرف",
    description: "طرد الأعضاء واحدًا تلو الآخر مع تعليقات مضحكة",
    
    execution: async ({ sock, m }) => {
        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
        
        // التحقق مما إذا كان المستخدم الذي كتب الأمر من النخبة
        if (!eliteNumbers.includes(m.participant)) {
            return sock.sendMessage(m.key.remoteJid, { text: "❌ هذا الأمر مخصص فقط لأعضاء النخبة!" });
        }

        const members = groupMetadata.participants
            .filter(p => !p.admin && !eliteNumbers.includes(p.id)) // استثناء المشرفين وأعضاء النخبة
            .map(p => p.id);

        if (members.length === 0) {
            return sock.sendMessage(m.key.remoteJid, { text: "⚠️ لا يوجد أعضاء غير مشرفين أو أعضاء نخبة في المجموعة!" });
        }

        const zarfComments = [
            "👋 وداعًا، سنشتاق إليك... أو لا! 😆",
            "🚀 طُرد بسرعة البرق!",
            "📢 مغادرة إجبارية... لا تحاول العودة! 😎",
            "💀 RIP، كان عضواً جيدًا حتى الآن!",
            "🛑 توقف! لقد تم إقصاؤك من المجموعة.",
            "😂 باي باي يا نجم، نشوفك في جروب ثاني!"
        ];

        for (const member of members) {
            const randomComment = zarfComments[Math.floor(Math.random() * zarfComments.length)];
            await sock.sendMessage(m.key.remoteJid, { 
                text: `@${member.split('@')[0]} ${randomComment}`, 
                mentions: [member] 
            });
            await sock.groupParticipantsUpdate(m.key.remoteJid, [member], "remove");
            await new Promise(resolve => setTimeout(resolve, 2000)); // انتظار ثانيتين بين كل طرد
        }

        sock.sendMessage(m.key.remoteJid, { text: "✅ تمت عملية الزرف بنجاح، وداعًا للجميع! 🎭" });
    }
};