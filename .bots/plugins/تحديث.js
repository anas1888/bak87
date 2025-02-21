import { execSync } from 'child_process';

let handler = async (m, { conn, text }) => {
    try {
        await m.react(rwait);
        
        if (conn.user.jid == conn.user.jid) {
            let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
            await conn.reply(m.chat, stdout.toString(), m, rcanal);
            await m.react(done);
        }

    } catch (e) {
        await m.react(error);
        await m.reply('🚩 هناك تغييرات محلية تتعارض مع تحديثات المستودع. لتحديث البوت، يرجى إعادة تثبيته أو القيام بالتحديثات يدويًا.');
    }
};

handler.help = ['تحديث', 'update'];
handler.tags = ['المالك'];
handler.command = ['تحديث', 'update'];
handler.rowner = true;

export default handler;