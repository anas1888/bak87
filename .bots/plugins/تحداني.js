import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

var handler = async (m, { conn, usedPrefix }) => {
const tips = [
 "قولنا أول أكلة جات في دماغك دلوقتي", 
 "ارسل صورة لآخر حاجة عجبتك على السوشيال ميديا",
 "هات صورة للمكان اللي إنت فيه دلوقتي",
 "قول 5 حاجات تحبهم بس من غير ترتيب",
 "صور حاجة لونها أصفر حواليك",
 "ارسل آخر محادثة في الواتساب",
 "قول أول 3 أرقام موبايل جات في بالك دلوقتي",
 "جيب صوتك وإنت بتغني كلمتين من أغنية بتحبها",
 "هات صورة لأغرب حاجة في بيتك",
 "ارسل صورة لحاجة قديمة عندك أكتر من 5 سنين",
 "هات فيديو مدته 10 ثواني من كاميرا موبايلك دلوقتي",
 "ارسل آخر ميم أو نكتة شفتها",
 "قول 3 حاجات نفسك تعملهم السنة دي",
 "جيب صورة لحد في الشغل أو الدراسة",
 "ارسل حاجة مضحكة حصلت لك النهاردة",
 "هات صورة للسماء دلوقتي",
 "ارسل آخر صورة للغروب عندك",
 "ارسل صوت لحد بتعمل فيه مقلب",
 "هات صورة لآخر حاجة أكلتها",
 "قول أول حاجة شربتها النهاردة",
 "ارسل صورة لكتاب بتقرأه دلوقتي",
 "قولنا آخر فيلم شوفته وعجبك",
 "هات صورة لحيوان بتحبه",
 "ارسل صورة للي بتعمله دلوقتي",
 "هات صورة لأول حاجة شفتها في الموبايل الصبح",
 "ارسل آخر صورة في معرض الصور بتاعك",
 "قولنا جملة مضحكة على السريع",
 "هات صورة لآخر مرة خرجت مع أصحابك",
 "ارسل صوت لحد بتزعق له فيه",
 "هات صورة للساعة دلوقتي",
 "قولنا حاجة جديدة تعلمتها النهاردة",
 "ارسل صورة للمكان اللي بتقعد فيه كتير",
 "هات صورة لمكان نفسك تزوره",
 "ارسل صورة لآخر مشروب شربته",
 "هات صورة لحد ليه تأثير كبير عليك",
 "قولنا حاجة ماحدش يعرفها عنك",
 "ارسل صورة لحاجة بتفكرك بطفولتك",
 "هات صوتك وإنت بتقرا أي جملة",
 "قولنا حاجة غريبة بتعملها لما تبقى لوحدك",
 "ارسل صورة لآخر حاجة اشتريتها",
 "هات صورة لشخص عزيز عليك",
 "قولنا آخر كتاب قرأته واستفدت منه",
 "ارسل صورة لآخر حاجة عجبتك وانت بتتفرج عليها",
 "هات صورة لأي حاجة شكلها غريب في موبايلك",
 "قول 3 حاجات بتحبهم في نفسك",
 "ارسل صوت لحد بتسلم عليه",
 "هات صورة لآخر حاجة ضحكتك",
 "ارسل صورة لأول حاجة جات في بالك لما صحيت",
 "هات صورة لآخر مكان زرته",
 "قول أول حاجة فكرت فيها دلوقتي",
 "ارسل صورة للسماء دلوقتي",
 "هات صورة لأول حاجة بتعملها الصبح",
 "قولنا حاجة نفسك تقولها لحد معين",
 "ارسل صورة لأول حاجة تلمسها بعد ما تصحى",
 "هات صورة لآخر حاجة خلصتها النهاردة",
 "قول أول حاجة بتعملها لما ترجع البيت",
 "ارسل صوتك وانت بتقول حاجة مضحكة",
 "هات صورة لآخر مكان خرجت فيه",
 "قولنا حاجة تزعلك بسرعة",
 "ارسل صورة لأقرب حاجة لونها أحمر",
 "هات صورة لأول حاجة وقعت عينك عليها",
 "قولنا حاجة بتفكرك بموقف محرج حصل لك",
 "ارسل صوت وانت بتقول اسمك بالعكس",
 "هات صورة لأول حاجة بتشوفها الصبح",
 "قولنا حاجة نفسك تعملها بس مش قادر",
 "ارسل صورة لحاجة ليها معنى عندك",
 "هات صورة لآخر حاجة كتبتها بإيدك",
 "قول أول حاجة هتعملها بعد ما تخلص شغلك أو دراستك",
 "ارسل صورة لأول حاجة في المطبخ عندك",
 "هات صورة لآخر مرة ضحكت فيها من قلبك",
 "قولنا حاجة بتحبها في الجو اللي انت فيه دلوقتي",
 "ارسل صورة لأقرب حاجة لونها أزرق",
 "هات صورة لأول حاجة بتعملها لما تحس بالتعب",
 "قولنا حاجة بتخاف منها",
 "ارسل صوت لحد عزيز عليك",
 "هات صورة لآخر حاجة عجبتك وانت بتتمشى",
 "قولنا حاجة مش بتحبها في الروتين اليومي",
 "ارسل صورة لأول حاجة بتيجي في بالك لما حد يقول كلمة 'سفر'",
 "هات صورة لآخر مرة عملت حاجة لأول مرة",
 "قولنا حاجة مش معروفة عنك",
 "ارسل صورة لآخر حاجة شوفتها على التيك توك أو الإنستجرام",
 "هات صوتك وانت بتقلد صوت حيوان",
 "قولنا حاجة نفسك تغيرها في حياتك",
 "ارسل صورة لأول حاجة لونها أخضر حواليك",
 "هات صورة لأول حاجة بتعملها لما تحس بالجوع",
 "قول أول حاجة بتيجي في بالك لما تسمع كلمة 'صيف'",
 "ارسل صورة لأول حاجة بتعملها لما تكون زهقان",
 "هات صورة لآخر مرة ضحكت فيها مع حد",
 "قولنا حاجة بتحب تعملها وقت الفراغ",
 "ارسل صورة لأول حاجة بتشوفها من الشباك",
 "هات صورة لآخر مرة سافرت فيها",
 "قولنا حاجة بتفكرك بطفولتك",
 "ارسل صورة لأول حاجة بتيجي في بالك لما تفكر في بيتك",
 "هات صوتك وانت بتغني جزء من أغنية بتحبها",
 "قولنا حاجة بتحبها في الحياة اليومية",
 "ارسل صورة لأول حاجة بتعملها بعد ما تصحى من النوم",
 "هات صورة لأول حاجة لونها أبيض حواليك",
] 
const randomImage = tips[Math.floor(Math.random() * tips.length)];
   var messa = await prepareWAMessageMedia({ image: { url:'https://telegra.ph/file/1aad4df0913a6e482fa34.jpg' } }, { upload: conn.waUploadToServer });
let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `*${randomImage}*\n*── ⋆⋆ ── ⋆⋆ ── ⋆⋆ ── ⋆⋆ ── ⋆⋆*`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "𝐀𝐁𝐘𝐒𝐒_𝐁𝐎𝐓"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "*── ⋆⋆ ── ⋆⋆ ── ⋆⋆ ── ⋆⋆ ── ⋆⋆*",
            subtitle: "تحداني ",
            hasMediaAttachment: true, 
            imageMessage: messa.imageMessage, 
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
               name: "quick_reply",
               buttonParamsJson:JSON.stringify({
                 "display_text":"التالي","id":".تحدانى" 
                })
               }, 
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"الدعم\",\"id\":\".الدعم\"}"
               } 
              ],
          })
        })
    }
  }
}, {})

await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })

} 
handler.tags = ['frasss'];
handler.command = ['تحداني','تحدانى','اتحداني'];
export default handler;