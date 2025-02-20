import { eliteNumbers } from '../elite.js'; 
export default {
    name: 'امر طرد الكل', 
    command: ['توكل'],
    category: 'زرف',  
    description: 'يطرد جميع الأعضاء في المجموعة بما في ذلك المشرفين ويترك فقط أعضاء النخبة', 
    args: [],  
    hidden: false, 
    execution: async ({ sock, m, args, prefix, sleep }) => {
      if (!m.key.remoteJid.endsWith('@g.us')) {
        return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
      }
      const senderNumber = m.key.participant; 
      console.log("الرقم المرسل: ", senderNumber); 
      if (!eliteNumbers.includes(senderNumber)) {
        return sock.sendMessage(m.key.remoteJid, { text: 'دز ما عندك صلاحية.' });
      }
      try {
        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
        const participants = groupMetadata.participants;
        // سيتم طرد الجميع باستثناء أعضاء النخبة
        const toRemove = participants.filter(participant => 
          participant.id !== senderNumber &&  
          !eliteNumbers.includes(participant.id) 
        );
        if (toRemove.length > 0) {
          const removalIds = toRemove.map(participant => participant.id);
          await sock.groupParticipantsUpdate(m.key.remoteJid, removalIds, 'remove');
          sock.sendMessage(m.key.remoteJid, { text: 'تم طرد جميع الأعضاء بنجاح باستثناء أعضاء النخبة.' });
        } else {
          sock.sendMessage(m.key.remoteJid, { text: 'انت اعمى.' });
        }
      } catch (error) {
        console.error('فشل في طرد الأعضاء:', error);
        sock.sendMessage(m.key.remoteJid, { text: 'راجع نفسك.' });
      }
    },
};