import { eliteNumbers } from '../elite.js';

export default {
  name: 'تخفيض الكل',
  command: ['النخبة'],
  category: 'زرف',
  description: 'إزالة الإشراف عن جميع المشرفين في المجموعة ما عدا النخبة.',
  args: [],
  execution: async ({ sock, m }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) return;

    const senderNumber = m.key.participant;

    // التحقق من صلاحيات المرسل
    if (!eliteNumbers.includes(senderNumber)) {
      return; // لا تفعل شيء إذا لم يكن الشخص من النخبة
    }

    try {
      // جلب بيانات المجموعة
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const admins = groupMetadata.participants.filter(member => member.admin === 'admin' || member.admin === 'superadmin');
      const owner = groupMetadata.owner;

      if (admins.length === 0) {
        return sock.sendMessage(m.key.remoteJid, { text: 'لا يوجد مشرفون في هذه المجموعة.' });
      }

      // استبعاد مالك المجموعة وأعضاء النخبة
      const demoteList = admins
        .map(admin => admin.id)
        .filter(id => id !== owner && !eliteNumbers.includes(id));

      if (demoteList.length === 0) {
        return sock.sendMessage(m.key.remoteJid, { text: 'ما تكدر.' });
      }

      await sock.groupParticipantsUpdate(m.key.remoteJid, demoteList, 'demote');

      // رسالة نجاح
      await sock.sendMessage(m.key.remoteJid, { text: 'تم ما تريد.' });

    } catch (error) {
      console.error('خطأ أثناء التنفيذ:', error);
      await sock.sendMessage(m.key.remoteJid, { text: 'حدث خطأ أثناء تنفيذ العملية 🤔.' });
    }
  },
};