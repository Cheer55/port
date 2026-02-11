// ==================== ตัวแปรสถานะเกม ====================
// เก็บสถานะของกระดานเกม 9 ช่อง (index 0-8) โดยเริ่มต้นเป็นค่าว่าง
let board = ['', '', '', '', '', '', '', '', ''];

// เก็บว่าตอนนี้เป็นตาของผู้เล่นคนไหน (X หรือ O)
let currentPlayer = 'X';

// เก็บโหมดเกมที่เลือก (pvp, pvc, หรือ cvc)
let gameMode = 'pvp';

// เก็บระดับความยากของ AI (easy, medium, hard)
let difficulty = 'medium';

// เก็บสถานะว่าเกมกำลังเล่นอยู่หรือไม่
let gameActive = false;

// เก็บสถานะว่าตอนนี้เป็นตาของคอมพิวเตอร์หรือไม่ (ใช้ป้องกันการคลิกซ้ำ)
let isComputerTurn = false;

// ==================== ดึง DOM Elements ====================
// ดึง dropdown สำหรับเลือกโหมดเกม
const gameModeSelect = document.getElementById('gameMode');

// ดึง dropdown สำหรับเลือกระดับความยาก
const difficultySelect = document.getElementById('difficulty');

// ดึง section ที่แสดงตัวเลือกระดับความยาก
const difficultySection = document.getElementById('difficultySection');

// ดึงปุ่มเริ่มเกมใหม่
const startGameBtn = document.getElementById('startGame');

// ดึงปุ่มรีเซ็ตเกม
const resetGameBtn = document.getElementById('resetGame');

// ดึงกระดานเกม
const gameBoard = document.getElementById('gameBoard');

// ดึงข้อความแสดงสถานะเกม
const gameStatus = document.getElementById('gameStatus');

// ดึงข้อความแสดงผู้เล่นปัจจุบัน
const currentPlayerDisplay = document.getElementById('currentPlayer');

// ดึงทุกช่องในกระดานเกม (9 ช่อง)
const cells = document.querySelectorAll('.cell');

// ==================== รูปแบบการชนะ ====================
// เก็บรูปแบบการชนะทั้งหมด 8 แบบ (3 แถว, 3 คอลัมน์, 2 เส้นทแยง)
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // แถวบน, แถวกลาง, แถวล่าง
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // คอลัมน์ซ้าย, คอลัมน์กลาง, คอลัมน์ขวา
    [0, 4, 8], [2, 4, 6] // เส้นทแยงซ้ายไปขวา, เส้นทแยงขวาไปซ้าย
];

// ==================== Event Listeners ====================
// เมื่อเปลี่ยนโหมดเกม ให้เรียกฟังก์ชัน handleModeChange
gameModeSelect.addEventListener('change', handleModeChange);

// เมื่อกดปุ่มเริ่มเกมใหม่ ให้เรียกฟังก์ชัน startNewGame
startGameBtn.addEventListener('click', startNewGame);

// เมื่อกดปุ่มรีเซ็ต ให้เรียกฟังก์ชัน resetGame
resetGameBtn.addEventListener('click', resetGame);

// เมื่อคลิกที่ช่องใดช่องหนึ่งในกระดาน ให้เรียกฟังก์ชัน handleCellClick
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// ==================== เริ่มต้นโปรแกรม ====================
// เรียกฟังก์ชันเพื่อตั้งค่าเริ่มต้นตามโหมดที่เลือก
handleModeChange();

/**
 * ฟังก์ชันจัดการเมื่อเปลี่ยนโหมดเกม
 * แสดง/ซ่อนตัวเลือกระดับความยากตามโหมดที่เลือก
 */
function handleModeChange() {
    // เก็บค่าโหมดที่เลือกไว้ในตัวแปร gameMode
    gameMode = gameModeSelect.value;
    
    // ถ้าเป็นโหมด PvP (ผู้เล่น vs ผู้เล่น)
    if (gameMode === 'pvp') {
        // ซ่อนตัวเลือกระดับความยาก (เพราะไม่มี AI)
        difficultySection.style.display = 'none';
    } else {
        // แสดงตัวเลือกระดับความยาก (สำหรับโหมดที่มี AI)
        difficultySection.style.display = 'block';
    }
    
    // อัพเดทข้อความแสดงสถานะ
    updateGameStatus('เลือกโหมดเกมและกดเริ่มเกมใหม่');
}

/**
 * ฟังก์ชันเริ่มเกมใหม่
 */
function startNewGame() {
    // ==================== รีเซ็ตสถานะเกม ====================
    // ล้างกระดานให้เป็นค่าว่างทั้งหมด
    board = ['', '', '', '', '', '', '', '', ''];
    
    // กำหนดให้ X เป็นผู้เล่นคนแรก
    currentPlayer = 'X';
    
    // เปิดสถานะเกม (เริ่มเล่นได้)
    gameActive = true;
    
    // ตั้งค่าว่าไม่ใช่ตาของคอมพิวเตอร์
    isComputerTurn = false;
    
    // เก็บค่าระดับความยากที่เลือกไว้
    difficulty = difficultySelect.value;
    
    // ==================== ล้างการแสดงผลกระดาน ====================
    // วนลูปทุกช่องในกระดาน
    cells.forEach(cell => {
        // ลบข้อความในช่อง
        cell.textContent = '';
        // รีเซ็ต class ให้เหลือแค่ 'cell'
        cell.className = 'cell';
    });
    
    // อัพเดทข้อความแสดงสถานะ
    updateGameStatus('เกมเริ่มแล้ว!');
    
    // อัพเดทข้อความแสดงผู้เล่นปัจจุบัน
    updateCurrentPlayer();
    
    // ==================== ถ้าเป็นโหมด CvC ====================
    // ถ้าเป็นโหมดคอมพิวเตอร์ vs คอมพิวเตอร์
    if (gameMode === 'cvc') {
        // รอ 1 วินาที แล้วให้คอมพิวเตอร์เดินตาแรก
        setTimeout(() => {
            makeComputerMove();
        }, 1000);
    }
}

/**
 * ฟังก์ชันรีเซ็ตเกม
 */
function resetGame() {
    // เรียกฟังก์ชันเริ่มเกมใหม่
    startNewGame();
}

/**
 * ฟังก์ชันจัดการเมื่อคลิกที่ช่องในกระดาน
 */
function handleCellClick(event) {
    // ดึงเลข index ของช่องที่ถูกคลิก (0-8)
    const cellIndex = parseInt(event.target.dataset.index);
    
    // ==================== ตรวจสอบว่าสามารถเดินได้หรือไม่ ====================
    // ถ้าเกมไม่ได้เปิดอยู่ หรือ ช่องนั้นมีค่าแล้ว หรือ เป็นตาของคอมพิวเตอร์
    if (!gameActive || board[cellIndex] !== '' || isComputerTurn) {
        // ไม่ทำอะไร (return ออกจากฟังก์ชัน)
        return;
    }
    
    // ==================== โหมด PvP ====================
    // ถ้าเป็นโหมดผู้เล่น vs ผู้เล่น
    if (gameMode === 'pvp') {
        // ให้ผู้เล่นปัจจุบันเดินที่ช่องนั้น
        makeMove(cellIndex, currentPlayer);
    }
    // ==================== โหมด PvC ====================
    // ถ้าเป็นโหมดผู้เล่น vs คอมพิวเตอร์
    else if (gameMode === 'pvc') {
        // ถ้าเป็นตาของผู้เล่น (X)
        if (currentPlayer === 'X') {
            // ให้ผู้เล่นเดิน
            makeMove(cellIndex, currentPlayer);
            
            // ตรวจสอบว่าเกมยังดำเนินต่อหรือไม่ และเป็นตาของคอมพิวเตอร์ (O)
            if (gameActive && currentPlayer === 'O') {
                // ตั้งค่าว่าเป็นตาของคอมพิวเตอร์ (ป้องกันการคลิกซ้ำ)
                isComputerTurn = true;
                // รอ 0.5 วินาที แล้วให้คอมพิวเตอร์เดิน
                setTimeout(() => {
                    makeComputerMove();
                }, 500);
            }
        }
    }
    // ==================== โหมด CvC ====================
    // โหมดคอมพิวเตอร์ vs คอมพิวเตอร์ จะเดินอัตโนมัติ ไม่รับ input จากผู้เล่น
}

/**
 * ฟังก์ชันเดินหมาก
 */
function makeMove(index, player) {
    // ตรวจสอบว่าช่องนั้นว่างและเกมยังเปิดอยู่หรือไม่
    if (board[index] !== '' || !gameActive) {
        return false; // ถ้าไม่ได้ ส่งค่า false กลับ
    }
    
    // ==================== อัพเดทสถานะกระดาน ====================
    // ใส่ค่า X หรือ O ลงในช่องนั้นของ array board
    board[index] = player;
    
    // ==================== อัพเดทการแสดงผล ====================
    // ดึงช่องที่ต้องการแสดงผล
    const cell = cells[index];
    // ใส่ข้อความ X หรือ O ลงในช่อง
    cell.textContent = player;
    // เพิ่ม class 'x' หรือ 'o' เพื่อเปลี่ยนสี
    cell.classList.add(player.toLowerCase());
    
    // ==================== ตรวจสอบผลเกม ====================
    // ตรวจสอบว่ามีผู้ชนะหรือไม่
    if (checkWinner()) {
        // ปิดเกม
        gameActive = false;
        // ไฮไลท์ช่องที่ชนะ
        highlightWinningCells();
        // แสดงข้อความผู้ชนะ
        updateGameStatus(`ผู้เล่น ${player} ชนะ!`);
        return true; // ส่งค่า true กลับ
    }
    
    // ตรวจสอบว่าเสมอหรือไม่
    if (checkDraw()) {
        // ปิดเกม
        gameActive = false;
        // แสดงข้อความเสมอ
        updateGameStatus('เสมอ!');
        return true; // ส่งค่า true กลับ
    }
    
    // ==================== สลับผู้เล่น ====================
    // ถ้าเป็น X ให้เปลี่ยนเป็น O, ถ้าเป็น O ให้เปลี่ยนเป็น X
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // อัพเดทข้อความแสดงผู้เล่นปัจจุบัน
    updateCurrentPlayer();
    
    return true; // ส่งค่า true กลับ (เดินสำเร็จ)
}

/**
 * ฟังก์ชันให้คอมพิวเตอร์เดินโดยใช้ Minimax Algorithm
 */
function makeComputerMove() {
    // ถ้าเกมปิดแล้ว ไม่ต้องทำอะไร
    if (!gameActive) return;
    
    // หาตำแหน่งที่ดีที่สุดโดยใช้ Minimax
    const bestMove = getBestMove();
    
    // ถ้าหาตำแหน่งได้ (ไม่ใช่ -1)
    if (bestMove !== -1) {
        // เดินที่ตำแหน่งนั้น
        makeMove(bestMove, currentPlayer);
    }
    
    // ตั้งค่าว่าไม่ใช่ตาของคอมพิวเตอร์แล้ว
    isComputerTurn = false;
    
    // ==================== ถ้าเป็นโหมด CvC ====================
    // ถ้าเป็นโหมดคอมพิวเตอร์ vs คอมพิวเตอร์ และเกมยังดำเนินต่อ
    if (gameMode === 'cvc' && gameActive) {
        // รอ 1 วินาที แล้วให้คอมพิวเตอร์ตัวถัดไปเดิน
        setTimeout(() => {
            isComputerTurn = true;
            makeComputerMove();
        }, 1000);
    }
}

/**
 * ฟังก์ชันหาตำแหน่งที่ดีที่สุดโดยใช้ Minimax Algorithm
 */
function getBestMove() {
    // ตั้งค่าคะแนนที่ดีที่สุดเป็นค่าต่ำสุด
    let bestScore = -Infinity;
    // ตั้งค่าตำแหน่งที่ดีที่สุดเป็น -1 (ยังไม่มี)
    let bestMove = -1;
    
    // ดึงค่าความลึกสูงสุดตามระดับความยาก
    const maxDepth = getMaxDepth();
    
    // วนลูปทุกช่องในกระดาน (0-8)
    for (let i = 0; i < 9; i++) {
        // ถ้าช่องนั้นว่าง
        if (board[i] === '') {
            // ลองใส่ค่าผู้เล่นปัจจุบันลงไป (จำลอง)
            board[i] = currentPlayer;
            
            // คำนวณคะแนนของตำแหน่งนี้โดยใช้ Minimax
            // เริ่มที่ depth 0, เป็นรอบของฝั่งตรงข้าม (false)
            let score = minimax(board, 0, false, maxDepth, -Infinity, Infinity);
            
            // เอาค่าออกจากช่อง (ยกเลิกการจำลอง)
            board[i] = '';
            
            // ถ้าคะแนนนี้ดีกว่าคะแนนที่ดีที่สุด
            if (score > bestScore) {
                // อัพเดทคะแนนที่ดีที่สุด
                bestScore = score;
                // อัพเดทตำแหน่งที่ดีที่สุด
                bestMove = i;
            }
        }
    }
    
    // ส่งตำแหน่งที่ดีที่สุดกลับไป
    return bestMove;
}

/**
 * ฟังก์ชันดึงค่าความลึกสูงสุดตามระดับความยาก
 */
function getMaxDepth() {
    // ใช้ switch case เลือกตามระดับความยาก
    switch (difficulty) {
        case 'easy': return 3;      // ง่าย: ลึก 3 ชั้น
        case 'medium': return 5;    // กลาง: ลึก 5 ชั้น
        case 'hard': return 9;      // ยาก: ลึกสูงสุด (9 ชั้นเพียงพอสำหรับกระดาน 3x3)
        default: return 5;          // ค่าเริ่มต้น: ลึก 5 ชั้น
    }
}

/**
 * Minimax Algorithm พร้อม Alpha-Beta Pruning
 * ใช้หาตำแหน่งที่ดีที่สุดโดยคำนวณทุกความเป็นไปได้
 */
function minimax(board, depth, isMaximizing, maxDepth, alpha, beta) {
    // ==================== ตรวจสอบสถานะสิ้นสุด ====================
    // ตรวจสอบว่ามีผู้ชนะหรือไม่
    const winner = getWinner();
    
    // ถ้าผู้เล่นปัจจุบัน (AI) ชนะ
    if (winner === currentPlayer) return 10 - depth; // คะแนนบวก (ยิ่งชนะเร็วยิ่งดี)
    
    // ถ้าฝั่งตรงข้ามชนะ
    if (winner === getOpponent(currentPlayer)) return depth - 10; // คะแนนลบ (ยิ่งแพ้ช้ายิ่งดี)
    
    // ถ้าเสมอ หรือ ถึงความลึกสูงสุดแล้ว
    if (checkDraw() || depth >= maxDepth) return 0; // คะแนนเป็น 0
    
    // ==================== Maximizing Player (AI) ====================
    // ถ้าเป็นรอบของ AI (พยายามเพิ่มคะแนน)
    if (isMaximizing) {
        // ตั้งค่าคะแนนสูงสุดเป็นค่าต่ำสุด
        let maxScore = -Infinity;
        
        // วนลูปทุกช่องในกระดาน
        for (let i = 0; i < 9; i++) {
            // ถ้าช่องนั้นว่าง
            if (board[i] === '') {
                // ลองใส่ค่า AI ลงไป
                board[i] = currentPlayer;
                
                // เรียก minimax แบบ recursive สำหรับรอบถัดไป (ฝั่งตรงข้าม)
                let score = minimax(board, depth + 1, false, maxDepth, alpha, beta);
                
                // เอาค่าออก
                board[i] = '';
                
                // เลือกคะแนนที่สูงกว่า
                maxScore = Math.max(score, maxScore);
                
                // อัพเดท alpha (คะแนนต่ำสุดที่ maximizer รับประกันได้)
                alpha = Math.max(alpha, score);
                
                // Alpha-Beta Pruning: ถ้า beta <= alpha ไม่ต้องตรวจสอบต่อ
                if (beta <= alpha) break;
            }
        }
        // ส่งคะแนนสูงสุดกลับ
        return maxScore;
    }
    // ==================== Minimizing Player (ฝั่งตรงข้าม) ====================
    // ถ้าเป็นรอบของฝั่งตรงข้าม (พยายามลดคะแนน)
    else {
        // ตั้งค่าคะแนนต่ำสุดเป็นค่าสูงสุด
        let minScore = Infinity;
        
        // วนลูปทุกช่องในกระดาน
        for (let i = 0; i < 9; i++) {
            // ถ้าช่องนั้นว่าง
            if (board[i] === '') {
                // ลองใส่ค่าฝั่งตรงข้ามลงไป
                board[i] = getOpponent(currentPlayer);
                
                // เรียก minimax แบบ recursive สำหรับรอบถัดไป (AI)
                let score = minimax(board, depth + 1, true, maxDepth, alpha, beta);
                
                // เอาค่าออก
                board[i] = '';
                
                // เลือกคะแนนที่ต่ำกว่า
                minScore = Math.min(score, minScore);
                
                // อัพเดท beta (คะแนนสูงสุดที่ minimizer รับประกันได้)
                beta = Math.min(beta, score);
                
                // Alpha-Beta Pruning: ถ้า beta <= alpha ไม่ต้องตรวจสอบต่อ
                if (beta <= alpha) break;
            }
        }
        // ส่งคะแนนต่ำสุดกลับ
        return minScore;
    }
}

/**
 * ฟังก์ชันหาฝั่งตรงข้าม
 */
function getOpponent(player) {
    // ถ้าเป็น X ส่ง O กลับ, ถ้าเป็น O ส่ง X กลับ
    return player === 'X' ? 'O' : 'X';
}

/**
 * ฟังก์ชันตรวจสอบว่ามีผู้ชนะหรือไม่
 */
function checkWinner() {
    // เรียกฟังก์ชัน getWinner() และตรวจสอบว่าไม่ใช่ null
    return getWinner() !== null;
}

/**
 * ฟังก์ชันหาผู้ชนะ (ส่งค่า 'X', 'O', หรือ null กลับ)
 */
function getWinner() {
    // วนลูปทุกรูปแบบการชนะ
    for (let combination of winningCombinations) {
        // แยกตำแหน่ง 3 ตำแหน่งออกมา
        const [a, b, c] = combination;
        
        // ตรวจสอบว่าช่อง a มีค่า และ ช่อง a, b, c มีค่าเหมือนกันหรือไม่
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // ส่งค่าผู้ชนะกลับ (X หรือ O)
            return board[a];
        }
    }
    // ถ้าไม่มีผู้ชนะ ส่ง null กลับ
    return null;
}

/**
 * ฟังก์ชันตรวจสอบว่าเกมเสมอหรือไม่
 */
function checkDraw() {
    // ตรวจสอบว่าทุกช่องมีค่าแล้ว (ไม่มีช่องว่าง) และ ไม่มีผู้ชนะ
    return board.every(cell => cell !== '') && !checkWinner();
}

/**
 * ฟังก์ชันไฮไลท์ช่องที่ชนะ
 */
function highlightWinningCells() {
    // วนลูปทุกรูปแบบการชนะ
    for (let combination of winningCombinations) {
        // แยกตำแหน่ง 3 ตำแหน่งออกมา
        const [a, b, c] = combination;
        
        // ตรวจสอบว่าช่อง a มีค่า และ ช่อง a, b, c มีค่าเหมือนกันหรือไม่
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // เพิ่ม class 'winner' ให้กับช่องทั้ง 3 (เพื่อเปลี่ยนสีและทำ animation)
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
            // หยุดลูป (เพราะหาเจอแล้ว)
            break;
        }
    }
}

/**
 * ฟังก์ชันอัพเดทข้อความแสดงสถานะเกม
 */
function updateGameStatus(message) {
    // เปลี่ยนข้อความในส่วนแสดงสถานะเกม
    gameStatus.textContent = message;
}

/**
 * ฟังก์ชันอัพเดทข้อความแสดงผู้เล่นปัจจุบัน
 */
function updateCurrentPlayer() {
    // ถ้าเกมยังเปิดอยู่
    if (gameActive) {
        // ตัวแปรเก็บข้อความที่จะแสดง
        let playerText = '';
        
        // ถ้าเป็นโหมด PvP
        if (gameMode === 'pvp') {
            playerText = `ตาของ: ${currentPlayer}`;
        }
        // ถ้าเป็นโหมด PvC
        else if (gameMode === 'pvc') {
            // ถ้าเป็น X แสดงว่าเป็นผู้เล่น, ถ้าเป็น O แสดงว่าเป็นคอมพิวเตอร์
            playerText = currentPlayer === 'X' ? 'ตาของ: ผู้เล่น (X)' : 'ตาของ: คอมพิวเตอร์ (O)';
        }
        // ถ้าเป็นโหมด CvC
        else if (gameMode === 'cvc') {
            playerText = `ตาของ: คอมพิวเตอร์ ${currentPlayer}`;
        }
        
        // แสดงข้อความ
        currentPlayerDisplay.textContent = playerText;
    }
    // ถ้าเกมปิดแล้ว
    else {
        // ล้างข้อความ
        currentPlayerDisplay.textContent = '';
    }
}