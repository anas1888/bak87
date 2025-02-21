import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/Tdxwk.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  
  let who = m.messageStubParameters[0] + '@s.whatsapp.net';
  let user = global.db.data.users[who];

  let userName = user ? user.name : await import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true; // التأكد من أن الرسالة جماعية

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/nrLHp.jpg');
  let img = await (await fetch(pp)).buffer();
  let chat = global.db.data.chats[m.chat] || {};

  let who = m.messageStubParameters[0] + '@s.whatsapp.net';
  let user = global.db.data.users[who];
  let userName = user ? user.name : await conn.getName(who);

  // رسالة الترحيب
  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let bienvenida = `*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*\n*┇❄️┇⇇ منور يا برو المجموعه*\n*┇❄️┇ منشن العضور ⇇ ⟦@user⟧ ➥*\n*┇❄️┇ المجموعه ⇇ ⟦@subject⟧ ➥*\n*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*`;
    await conn.sendMessage(m.chat, { text: bienvenida.replace('@user', userName).replace('@subject', groupMetadata.subject), mentions: [who], image: img });
  }

  // رسالة الوداع
  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    let bye = `*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*\n*┇❄️┇⇇ غادر عضو المجموعه*\n*┇❄️┇ منشن العضور ⇇ ⟦@user⟧ ➥*\n*┇❄️┇ المجموعه ⇇ ⟦@subject⟧ ➥*\n*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*`;
    await conn.sendMessage(m.chat, { text: bye.replace('@user', userName).replace('@subject', groupMetadata.subject), mentions: [who], image: img });
  }

  // رسالة الطرد
  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    let kick = `*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*\n*┇❄️┇⇇ تم طرد عضو من المجموعه*\n*┇❄️┇ منشن العضور ⇇ ⟦@user⟧ ➥*\n*┇❄️┇ المجموعه ⇇ ⟦@subject⟧ ➥*\n*⧈─╼━╾╼━┇•❄️•┇━╾─╼╾─⧈*`;
    await conn.sendMessage(m.chat, { text: kick.replace('@user', userName).replace('@subject', groupMetadata.subject), mentions: [who], image: img });
  }
}