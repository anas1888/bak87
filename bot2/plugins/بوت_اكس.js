const games = {}; 

class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
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

    botMove() {
        let emptyCells = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (emptyCells.length > 0) {
            let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.play(move);
        }
    }
}

async function updateBoard(player, sock, chatId) {
    let game = games[player];
    if (!game) return;

    let arr = game.render().map(v => ({
        '❎': '❎', '⭕': '⭕',
        1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 
        4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 
        7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
    }[v] || v));

    let winner = game.winner;
    let boardMessage = `
🎮 *لعبة إكس-أو* 🎮

❎ = اللاعب  
⭕ = البوت 🤖  

${arr.slice(0, 3).join(' ')}
${arr.slice(3, 6).join(' ')}
${arr.slice(6, 9).join(' ')}

${winner ? `🏆 *الفائز:* ${winner === 'draw' ? 'تعادل!' : (winner === '❎' ? 'اللاعب' : 'البوت 🤖')}` : `🔄 دورك، أرسل رقمًا بين 1-9`}
`.trim();

    await sock.sendMessage(chatId, { text: boardMessage });

    // حذف اللعبة عند انتهاء الجولة
    if (winner) delete games[player];
}

export default {
    name: 'إكس-أو',
    command: ['اكس_بوت'],
    category: 'ترفيه',
    description: 'لعبة إكس-أو ضد البوت 🤖',
    args: [],
    execution: async ({ sock, m }) => {
        const player = m.key.remoteJid;

        if (!games[player]) {
            games[player] = new TicTacToe();
            await updateBoard(player, sock, m.key.remoteJid);
        }

        // 🔴 الاستماع للأرقام بعد بدء اللعبة
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || !msg.key.remoteJid) return;

            const chatId = msg.key.remoteJid;
            if (!games[chatId]) return; // لا يوجد لعبة نشطة

            const userResponse = msg.message.conversation?.trim();
            if (!userResponse || isNaN(userResponse)) return; // تجاهل أي رسالة غير رقمية

            let move = parseInt(userResponse) - 1;
            let game = games[chatId];

            if (!isNaN(move) && move >= 0 && move < 9) {
                if (game.play(move)) {
                    if (!game.winner) {
                        game.botMove();
                    }
                    await updateBoard(chatId, sock, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: "❌ حركة غير صالحة! اختر رقمًا متاحًا بين 1-9." });
                }
            }
        });
    },
};