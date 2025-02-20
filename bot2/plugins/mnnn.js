import { eliteNumbers } from '../elite.js';
export default {
  name: 'امر المنشن الجماعي',
  command: ['منشن'],
  category: 'كروب',
  description: 'إرسال منشن جماعي مع نوعين: خفي أو واضح',
  args: ['خ', 'ج'], 
  execution: async ({ sock, m, args }) => {
    const senderNumber = m.key.participant;
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(m.key.remoteJid, { text: 'دز يا ورع هدا أمر بس لي لمطوير 🥊.' });
    }

    const type = args[0];
    const participants = await sock.groupMetadata(m.key.remoteJid).then(metadata => metadata.participants);

    if (type === 'خ') {
      const hiddenMention = `『*_Sakamoto Days_*』`; 
      await sock.sendMessage(m.key.remoteJid, { 
        text: hiddenMention,
        mentions: participants.map(p => p.id) 
      });
    } else if (type === 'ج') {
      const mentionText = participants.map(p => `\n👑•@${p.id.split('@')[0]}`).join('\n'); 
      const captionText = `*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*\n\n*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*${mentionText}\n*✥━━━✥• ☯︎ ~┋❮👑❯┋~ ☯︎ •✥━━━✥*`;
      const videoPath = './1.mp4'; 

      await sock.sendMessage(m.key.remoteJid, {
        video: { url: videoPath },
        caption: captionText,
        mentions: participants.map(p => p.id) 
      });
    } else {
      const hiddenMention = args.join(' '); 
      await sock.sendMessage(m.key.remoteJid, { 
        text: hiddenMention,
        mentions: participants.map(p => p.id)
      });
    }
  },
  hidden: false,
};