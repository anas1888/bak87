const games = {}; 

class TicTacToe {
    constructor(difficulty = "متوسط") {
        this.board = Array(9).fill(null);
        this.currentPlayer = '❎';
        this.winner = null;
        this.difficulty = difficulty;
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

    async botMove() {
        await this.sleep(2000); // تأخير الرد

        if (this.difficulty === "سهل") {
            this.randomMove();
        } else if (this.difficulty === "متوسط") {
            if (!this.smartMove()) {
                this.randomMove();
            }
        } else {
            this.minimaxMove();
        }
    }

    randomMove() {
        let emptyCells = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (emptyCells.length > 0) {
            let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.play(move);
        }
    }

    smartMove() {
        let emptyCells = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);

        for (let move of emptyCells) {
            this.board[move] = '⭕';
            this.checkWinner();
            if (this.winner === '⭕') return true;
            this.board[move] = null;

            this.board[move] = '❎';
            this.checkWinner();
            if (this.winner === '❎') {
                this.board[move] = '⭕';
                return true;
            }
            this.board[move] = null;
        }
        return false;
    }

    minimaxMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        this.board.forEach((cell, i) => {
            if (cell === null) {
                this.board[i] = '⭕';
                let score = this.minimax(0, false);
                this.board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        });

        if (bestMove !== null) {
            this.play(bestMove);
        }
    }

    minimax(depth, isMaximizing) {
        this.checkWinner();
        if (this.winner === '⭕') return 1;
        if (this.winner === '❎') return -1;
        if (this.board.every(cell => cell !== null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            this.board.forEach((cell, i) => {
                if (cell === null) {
                    this.board[i] = '⭕';
                    let score = this.minimax(depth + 1, false);
                    this.board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            this.board.forEach((cell, i) => {
                if (cell === null) {
                    this.board[i] = '❎';
                    let score = this.minimax(depth + 1, true);
                    this.board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
 
     if (winner) {
    delete games[player]; // هذا يمنع تكدس البيانات في الذاكرة
}
    
}


export default {
    name: 'إكس-أو',
    command: ['او'],
    category: 'ترفيه',
    description: 'لعبة إكس-أو ضد البوت 🤖 بمستويات صعوبة مختلفة',
    args: ['سهل', 'متوسط', 'صعب'],
    execution: async ({ sock, m, args }) => {
        const chatId = m.key.remoteJid;
        const player = m.key.participant || chatId; // تحديد اللاعب سواء كان في مجموعة أو في الخاص
        const difficulty = args[0]?.toLowerCase() || "متوسط";

        if (!["سهل", "متوسط", "صعب"].includes(difficulty)) {
            await sock.sendMessage(chatId, { text: "❌ اختر مستوى صعوبة صحيح: `سهل - متوسط - صعب`" });
            return;
        }

        if (!games[player]) {
            games[player] = new TicTacToe(difficulty);
            await updateBoard(player, sock, chatId);
        }

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || !msg.key.remoteJid) return;

            const chat = msg.key.remoteJid;
            const sender = msg.key.participant || chat;
            if (!games[sender]) return;

            const userResponse = msg.message.conversation?.trim();
            if (!userResponse || isNaN(userResponse)) return;

            let move = parseInt(userResponse) - 1;
            let game = games[sender];

            if (!isNaN(move) && move >= 0 && move < 9) {
                if (game.play(move)) {
                    if (!game.winner) {
                        await game.botMove();
                    }
                    await updateBoard(sender, sock, chat);
                }
            }
        });
    },
};