function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms % 3600000 / 60000);
    let s = Math.floor(ms % 60000 / 1000);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

const handler = async (m, {conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems}) => {
    let d = new Date(new Date + 3600000);
    let locale = 'ar';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let user = global.db.data.users[m.sender];
    let name = conn.getName(m.sender)
    let { money, joincount } = global.db.data.users[m.sender];
    let { exp, limit, level, role } = global.db.data.users[m.sender];
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;
    let more = String.fromCharCode(8206);
    let readMore = more.repeat(850);
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];
  await conn.sendMessage(m.chat, { react: { text: '🍡', key: m.key } })
  const Elsony = 'https://qu.ax/EkkRk.jpg'
  const mentionId = m.key.participant || m.key.remoteJid;
 
conn.relayMessage(m.chat, { viewOnceMessage: { message: { interactiveMessage: { header: { title: `gataVidMenu`}, body: { text: `*┊🌸┊⇇مـنـور يـا @${mentionId.split('@')[0]} اتـمـنـي ان انـكـ/ي تـسـمـتـ؏ـ/ـي بي وقتك*
*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🍬❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*
*↜مـعلـومـاتـك يـا مـز/ه🐤🍭↶*
*❍━━━══━━❪🌸❫━━══━━━❍*
*🍬┊⇇الـمـنـشـن↜❪@${mentionId.split('@')[0]}❫*
*🍭┊⇇الـرتـبـه↜❪${role}❫*
*🌸┊⇇الـمـسـتـوي↜❪${level}❫*
*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🍬❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*
*↜مـعـلـومـات مـطـوري😜🔞↶*
*❍━━━══━━❪🌸❫━━══━━━❍*
*🍷┊⇇الـقـب↶*
> *𝑅𝐴𝐷𝐼𝑂 𝐷𝐸𝑀𝑂𝑁*
*🧭┊⇇الـرقـم↶*
> https://wa.me/201063808608 
*⊏─๋︩︪─๋︩︪─๋︩︪─๋︩︪─═͜⊐❪🍬❫⊏═─๋︩︪─๋︩︪─๋︩︪─๋︩︪─๋︩︪─⊐*
*╮═━━━━━━✦✿✦━━━━━━═╭*   
*┊     ｢🌸┊التـنـبـيـهـات┊🌸｣     ┊*
*╯═━━━━━━✦✿✦━━━━━━═╰*
*❪1❫↜ممنوع سب البوت*
*❪2❫↜للشكوه او للاقتراح↶*
> *.ابلاغ*
*❪3❫↜ضغط علي الزر لي عرض الاوامر*
*❪4❫↜لا تنسي قبل اي امر↜❪.❫*
*❪5❫↜اول اربع اقسام شغلين فقط*
*❍━━━══━━❪🌸❫━━══━━━❍*`,subtitle: "Elsony",},header: { hasMediaAttachment: true,...(await prepareWAMessageMedia({ image : { url: Elsony } }, { upload: conn.waUploadToServer }, {quoted: m}))},
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: false,
                    },nativeFlowMessage: { buttons: [


                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title:'｢🍭┊اوامر┊🍬｣',
                                    sections: [
                                        {
                                            title: 'مــرحـ🛡ـبــا بــك فـي مــ☑هــام البـ🤖ـوت',
                                            highlight_label: '𝐀𝐁𝐘𝐒𝐒_𝐁𝐎𝐓',
                                            rows: [
                                                {
                                                    header: 'الــقـ👑ـســم الـاول',
                                                    title: '｢❆┊قـــــســــم_الا؏ــضـاء┊❆｣',
                                                    description: '',
                                                    id: '.ق1'
                                                },
                                                {
                                                    header: 'الــقـ👨🏻‍💻ـســم الــثــانــي',
                                                    title: '｢❆┊قــــــســـــــم_الــصـور┊❆｣',
                                                    description: '',
                                                    id: '.ق2'
                                                },
                                                {
                                                    header: 'الــقـ🐦‍🔥ـســم الــثــالــث',
                                                    title: '｢❆┊قــــــســـــــم_الــمشرفين┊❆｣',
                                                    description: '',
                                                    id: '.ق3'
                                                },
                                                {
                                                    header: 'الــقـ👑ـســم الــرابــع',
                                                    title: '*｢❆┊قــــــســـــــم_التحويلات┊❆｣*',
                                                    description: '',
                                                    id: '.ق4'
                                                },
                                                {
                                                    header: 'الــقـ🛡ـســم الــخــامــس',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م4'
                                                },
                                                {
                                                    header: 'الــقـ🕹ـســم الــســادس',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م5'
                                                },
                                                {
                                                    header: 'الــقـ🌀ـســم الــســابــع',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م6'
                                                },
                                                {
                                                    header: 'الــقـ🎧ـســم الــثــامـن',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م7'
                                                },
                                                {
                                                    header: 'الــقـ🤖ـســم الــتــاســع',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م8'
                                                },
                                                {
                                                    header: 'الــقـ🚨ـســم الــعــاشــر',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م9'
                                                },
                                                {
                                                    header: 'الــقـ🔍ـســم �لــحــاديــة عــشــر',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م12'
                                                },
                                                {
                                                    header: 'الــقـ📽️ـســم الــثــانــي عــشــر',
                                                    title: 'SOON',
                                                    description: '',
                                                    id: '.م13'
                                                },
                                                {
                                                    header: 'الــقـ👨🏻‍💻ـســم الــثــانــي عــشــر',
                                                    title: 'القوانين',
                                                    description: '',
                                                    id: '.القواعد'
                                               }
                                            ]
                                        }
                                    ]
                                }),
                  messageParamsJson: ''
                },
                {
              name: "quick_reply",
              buttonParamsJson: '{"display_text":"⌈🚀╎المطور╎🚀⌋","id":".المطور"}'
                     },
                     {
               name: "cta_url",
               buttonParamsJson: '{"display_text":"⌈📲╎قـنـاة الـمـطـور╎📲⌋","url":"https://whatsapp.com/channel/0029VaumDtWJZg4B8jLyMK2q","merchant_url":"https://whatsapp.com/channel/0029VaumDtWJZg4B8jLyMK2q"}'
                            }
                        ]
                    }
                }
            }
        }
    }, {});
}

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['menu', 'مهام', 'اوامر','الاوامر','قائمة','القائمة']

export default handler;