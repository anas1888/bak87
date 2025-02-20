import { eliteNumbers } from '../elite.js';

// تخزين الحالة لكل مجموعة
let groupStates = {};

export default {
  name: 'إدارة النخبة',
  command: ['ادارة', 'توقف'],
  category: 'أدوات',
  description: 'إدارة المجموعة تلقائيًا وحماية النخبة من الطرد.',
  execution: async ({ sock, m }) => {
    try {
      const groupId = m.key.remoteJid;
      const groupMetadata = await sock.groupMetadata(groupId);
      const currentParticipants = groupMetadata.participants;

      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isBotAdmin = currentParticipants.some(p => p.id === botNumber && p.admin === 'admin');

      if (!isBotAdmin) {
        return sock.sendMessage(groupId, { text: '❌ لا يمكن للبوت تنفيذ هذا الأمر لأنه ليس مشرفًا.' });
      }

      const sender = m.key.participant;

      // التحقق إذا كان المرسل من النخبة
      const isEliteMember = eliteNumbers.includes(sender);
      if (!isEliteMember) {
        return sock.sendMessage(groupId, { text: '❌ هذا الأمر مخصص فقط لأعضاء النخبة.' });
      }

      const messageText = m.message?.conversation || '';

      if (messageText.includes('ادارة')) {
        if (groupStates[groupId]?.isEnabled) {
          return sock.sendMessage(groupId, { text: '❌ القاعدة مفعلة بالفعل.' });
        }

        groupStates[groupId] = { isEnabled: true, intervalId: null };

        await sock.sendMessage(groupId, { text: '✅ تم تفعيل الإدارة التلقائية!' });

        groupStates[groupId].intervalId = setInterval(async () => {
          try {
            const updatedGroupMetadata = await sock.groupMetadata(groupId);
            const updatedParticipants = updatedGroupMetadata.participants;

            for (let participant of updatedParticipants) {
              // **1. إعادة الإشراف لأعضاء النخبة**
              if (!participant.admin && eliteNumbers.includes(participant.id)) {
                await sock.groupParticipantsUpdate(groupId, [participant.id], 'promote');
              }

              // **2. إزالة إشراف غير النخبة**
              if (participant.admin === 'admin' && !eliteNumbers.includes(participant.id)) {
                await sock.groupParticipantsUpdate(groupId, [participant.id], 'demote');
              }
            }

            // **3. إعادة إضافة الأعضاء المطرودين من النخبة**
            const participantIds = updatedParticipants.map(p => p.id);
            for (let eliteNumber of eliteNumbers) {
              if (!participantIds.includes(eliteNumber)) {
                try {
                  await sock.groupParticipantsUpdate(groupId, [eliteNumber], 'add');
                } catch (err) {
                  console.error(`⚠️ خطأ في إعادة إضافة العضو ${eliteNumber}:`, err);
                }
              }
            }

            // **4. التحقق من محاولات طرد النخبة وطرد المسؤول عن ذلك**
            for (let eliteNumber of eliteNumbers) {
              if (!updatedParticipants.some(p => p.id === eliteNumber)) {
                const responsibleAdmin = detectKicker(updatedParticipants, groupId);
                if (responsibleAdmin && responsibleAdmin !== botNumber) {
                  await sock.groupParticipantsUpdate(groupId, [responsibleAdmin], 'remove');
                }
              }
            }

          } catch (error) {
            console.error('⚠️ حدث خطأ أثناء التحقق الدوري:', error);
          }
        }, 1000);

      } else if (messageText.includes('توقف')) {
        if (!groupStates[groupId]?.isEnabled) {
          return sock.sendMessage(groupId, { text: '❌ القاعدة غير مفعلة.' });
        }

        clearInterval(groupStates[groupId].intervalId);
        delete groupStates[groupId];

        await sock.sendMessage(groupId, { text: '⛔ تم إيقاف الإدارة التلقائية لهذه المجموعة.' });
      }

    } catch (error) {
      console.error('⚠️ حدث خطأ أثناء تنفيذ الأمر:', error);
      await sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
  hidden: false,
};

// 🔍 دالة تحديد المشرف الذي قد يكون قام بالطرد
function detectKicker(participants, groupId) {
  const admins = participants.filter(p => p.admin === 'admin');
  return admins.length > 0 ? admins[0].id : null;
}