const games = {}; 

class TicTacToe {
    constructor(player1, player2) {
        this.board = Array(9).fill(null);
        this.players = { '❎': player1, '⭕': player2 };
        this.currentPlayer = '❎';
        this.winner = null;
    }

    render() {
        return this.board.map((v, i) => v || (i + 1));
    }

    play(index) {
        if (this.winner || this.board[index] !== null) return false;
        this.board[index] = this.currentPlayer;
        this.checkWinner();
        this.currentPlayer = this.currentPlayer === '❎' ? '⭕' : '❎';
        return true;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        for (let [a, b, c] of winPatterns) {
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                return;
            }
        }
        if (this.board.every(cell => cell !== null)) this.winner = "draw";
    }
}

async function updateBoard(game, sock, chatId) {
    let arr = game.render().map(v => ({
        '❎': '❎', '⭕': '⭕',
        1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 
        4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 
        7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
    }[v] || v));

    let winner = game.winner;
    let playerTag = winner ? "" : `👤 *الدور على:* @${game.players[game.currentPlayer].split('@')[0]}`;

    let boardMessage = `
🎮 *لعبة إكس-أو بين لاعبين* 🎮

❎ = @${game.players['❎'].split('@')[0]}
⭕ = @${game.players['⭕'].split('@')[0]}

${arr.slice(0, 3).join(' ')}
${arr.slice(3, 6).join(' ')}
${arr.slice(6, 9).join(' ')}

${winner ? `🏆 *الفائز:* ${winner === 'draw' ? 'تعادل!' : `@${game.players[winner].split('@')[0]}`}` : playerTag}
`.trim();

    await sock.sendMessage(chatId, { text: boardMessage, mentions: Object.values(game.players) });
}

export default {
    name: 'إكس-أو 2 لاعبين',
    command: ['اكس'],
    category: 'ترفيه',
    description: 'لعبة إكس-أو بين لاعبين 👥',
    args: [],
    execution: async ({ sock, m }) => {
        const chatId = m.key.remoteJid;
        const sender = m.key.participant || chatId;

        let text = m.message?.conversation || 
                   m.message?.extendedTextMessage?.text || 
                   Object.values(m.message)[0]?.text || 
                   "";

        if (text.trim() === "الغاء" && games[chatId]) {
            delete games[chatId];
            return sock.sendMessage(chatId, { text: "🚪 تم إنهاء اللعبة!" });
        }

        if (!games[chatId]) {
            let mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) {
                return sock.sendMessage(chatId, { text: "👥 تحتاج إلى منشن لاعب آخر لبدء اللعبة!\n\n🔹 *مثال:* `.اكس @player`" });
            }

            let player1 = sender;
            let player2 = mentioned[0];

            if (player1 === player2) return sock.sendMessage(chatId, { text: "❌ لا يمكنك اللعب ضد نفسك! اختر لاعبًا آخر." });

            games[chatId] = new TicTacToe(player1, player2);
            await updateBoard(games[chatId], sock, chatId);
        }

        // **🔄 إضافة استماع دائم للأرقام بعد بدء اللعبة 🔄**
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.remoteJid !== chatId) return;

            const userResponse = msg.message.conversation?.trim();
            if (!userResponse || isNaN(userResponse)) return;

            let move = parseInt(userResponse) - 1;
            let game = games[chatId];

            if (!game || game.winner) return; // تأكد أن اللعبة مستمرة
            if (msg.key.participant !== game.players[game.currentPlayer]) {
                return sock.sendMessage(chatId, { text: `⚠️ ليس دورك! انتظر حتى يلعب خصمك.` });
            }

            if (!isNaN(move) && move >= 0 && move < 9) {
                if (game.play(move)) {
                    await updateBoard(game, sock, chatId);
                    if (game.winner) delete games[chatId]; 
                } else {
                    await sock.sendMessage(chatId, { text: "❌ حركة غير صالحة! اختر رقمًا متاحًا بين 1-9." });
                }
            }
        });
    },
};