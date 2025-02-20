import { eliteNumbers } from '../elite.js';

let isEnabled = false;
let intervalId = null;

export default {
  name: 'إدارة النخبة',
  command: ['ابدا', 'قف'],
  category: 'أدوات',
  description: 'إدارة المجموعة تلقائيًا وحماية النخبة من الطرد.',
  execution: async ({ sock, m }) => {
    try {
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const currentParticipants = groupMetadata.participants;

      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isBotAdmin = currentParticipants.some(p => p.id === botNumber && p.admin === 'admin');

      if (!isBotAdmin) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ لا يمكن تفعيل القاعدة لأن البوت ليس مشرفًا.' });
      }

      const sender = m.key.participant;

      // التحقق إذا كان المرسل من النخبة
      const isEliteMember = eliteNumbers.includes(sender);
      if (!isEliteMember) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر خاص بالنخبة فقط.' });
      }

      const messageText = m.message?.conversation || '';

      if (messageText.includes('ابدا')) {

        if (isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة مفعلة بالفعل.' });
        }

        isEnabled = true;
        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل إدارة المجموعة وحماية النخبة.' });

        intervalId = setInterval(async () => {
          try {
            const updatedGroupMetadata = await sock.groupMetadata(m.key.remoteJid);
            const updatedParticipants = updatedGroupMetadata.participants;

            for (let participant of updatedParticipants) {
              // **1. إعادة الإشراف لأعضاء النخبة**
              if (!participant.admin && eliteNumbers.includes(participant.id)) {
                await sock.groupParticipantsUpdate(m.key.remoteJid, [participant.id], 'promote');
              }
            }

            // **2. إعادة إضافة الأعضاء المطرودين من النخبة**
            const participantIds = updatedParticipants.map(p => p.id);
            for (let eliteNumber of eliteNumbers) {
              if (!participantIds.includes(eliteNumber)) {
                try {
                  await sock.groupParticipantsUpdate(m.key.remoteJid, [eliteNumber], 'add');
                } catch (err) {
                  console.error(`⚠️ خطأ في إعادة إضافة العضو ${eliteNumber}:`, err);
                }
              }
            }

            // **3. التحقق من محاولات طرد النخبة وطرد المسؤول عن ذلك**
            for (let eliteNumber of eliteNumbers) {
              if (!updatedParticipants.some(p => p.id === eliteNumber)) {
                const responsibleAdmin = detectKicker(updatedParticipants);
                if (responsibleAdmin && responsibleAdmin !== botNumber) {
                  await sock.groupParticipantsUpdate(m.key.remoteJid, [responsibleAdmin], 'remove');
                }
              }
            }

          } catch (error) {
            console.error('⚠️ حدث خطأ أثناء التحقق الدوري:', error);
          }
        }, 1000);

      } else if (messageText.includes('قف')) {

        if (!isEnabled) {
          return sock.sendMessage(m.key.remoteJid, { text: '❌ القاعدة غير مفعلة.' });
        }

        isEnabled = false;
        clearInterval(intervalId);
        intervalId = null;

        await sock.sendMessage(m.key.remoteJid, { text: '✅ تم إيقاف إدارة المجموعة وحماية النخبة.' });
      }

    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء تنفيذ الأمر:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};

function detectKicker(participants) {
  // دالة للتحقق من المشرف الذي قام بالطرد
  const admins = participants.filter(p => p.admin === 'admin');
  return admins.length > 0 ? admins[0].id : null;
}