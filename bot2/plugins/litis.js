import { eliteNumbers } from '../elite.js';
export default {
  name: 'أمر البوم', 
  command: ['هبلة'],
  category: 'زرف', 
  description: 'يبدأ العد التنازلي للبوم ثم يطرد الأعضاء', 
  args: [],
  execution: async ({ sock, m, args, prefix, sleep }) => {
    const senderNumber = m.key.participant;
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(m.key.remoteJid, { text: 'روح العب بعيد يا زنجي.' });
    }
    try {
      await sock.sendMessage(m.key.remoteJid, { text: 'ليليث عمتكوم 🌹' });
      await sock.sendMessage(m.key.remoteJid, { text: 'عمتكوم ليليث بتقول باي 🌹' });
      for (let i = 3; i >= 0; i--) {
        await sleep(500);
        await sock.sendMessage(m.key.remoteJid, { text: `*${i.toString().padStart(2, '0')}: 🌹🍷*` });
      }
      await sock.sendMessage(m.key.remoteJid, { text: '*ليلـ🌹ـث*' });
      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const participants = groupMetadata.participants;
      const toRemove = participants.filter(participant => 
        participant.id !== sock.user.id 
      ).map(participant => participant.id);
      if (toRemove.length > 0) {
        await sock.groupParticipantsUpdate(m.key.remoteJid, toRemove, 'remove');
      } else {
        sock.sendMessage(m.key.remoteJid, { text: 'باح مفيش 🤣🌹.' });
      }
    } catch (error) {
      console.error('حدث خطأ أثناء تنفيذ أمر البوم:', error);
      sock.sendMessage(m.key.remoteJid, { text: '🌹 جرب تاني يا حوب .' });
    }
  },   hidden: false, 
};
