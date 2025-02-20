import { eliteNumbers } from '../elite.js';

let isProtectionEnabled = false;
let checkInterval;

export default {
  name: 'حماية النخبة',
  command: ['بط', 'دز'],
  category: 'أدوات',
  description: 'تفعيل حماية النخبة وطرد من يحاول طردهم.',
  execution: async ({ sock, m }) => {
    try {
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const currentParticipants = groupMetadata.participants;

      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isBotAdmin = currentParticipants.some(p => p.id === botNumber && p.admin === 'admin');

      if (!isBotAdmin) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ لا يمكن تفعيل الحماية لأن البوت ليس مشرفًا.' });
      }

      const messageText = m.message?.conversation || '';

      if (messageText.includes('بط')) {
        if (isProtectionEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ الحماية مفعلة بالفعل.' });
        }

        isProtectionEnabled = true;
        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل حماية النخبة.' });

        // تشغيل التحقق الدوري كل ثانية
        checkInterval = setInterval(async () => {
          try {
            const updatedMetadata = await sock.groupMetadata(m.key.remoteJid);
            const updatedParticipants = updatedMetadata.participants;

            // التحقق من عمليات الطرد
            for (const eliteMember of eliteNumbers) {
              if (!updatedParticipants.some(p => p.id === eliteMember)) {
                const responsibleAdmins = await detectKicker(sock, updatedParticipants);
                if (responsibleAdmins.length > 0) {
                  for (let admin of responsibleAdmins) {
                    if (admin !== botNumber) {
                      await sock.groupParticipantsUpdate(m.key.remoteJid, [admin], 'remove');
                      await sock.sendMessage(m.key.remoteJid, { 
                        text: `⚠️ تم طرد الشخص المسؤول عن طرد النخبة: @${admin.split('@')[0]}`, 
                        mentions: [admin] 
                      });
                    }
                  }
                }
              }
            }

          } catch (err) {
            console.error('⚠️ خطأ أثناء التحقق الدوري:', err);
          }
        }, 1000); // تحقق كل ثانية

      } else if (messageText.includes('دز')) {
        if (!isProtectionEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ الحماية غير مفعلة.' });
        }

        isProtectionEnabled = false;
        clearInterval(checkInterval);
        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم إيقاف حماية النخبة.' });
      }

    } catch (error) {
      console.error('⚠️ خطأ أثناء تنفيذ الحماية:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الحماية.' });
    }
  },
  hidden: false,
};

async function detectKicker(sock, participants) {
  // دالة للتحقق من المشرفين الذين قاموا بالطرد
  const admins = participants.filter(p => p.admin === 'admin');
  return admins.map(admin => admin.id);  // العودة إلى جميع المشرفين
}