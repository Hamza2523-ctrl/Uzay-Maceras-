let audioCtx = null;
let bgMusicTimer = null;
let battleMusicTimer = null;
let isMusicPlaying = false;
let isBattleMusicPlaying = false;
let noteIndex = 0;
let battleNoteIndex = 0;

const bgNotes = [220, 261.63, 329.63, 392, 329.63, 261.63, 196, 220];
const battleNotes = [110, 146.83, 110, 164.81, 110, 146.83, 196.00, 164.81];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function startBgMusic() {
    if (isMusicPlaying) return;
    stopBattleMusic();
    isMusicPlaying = true;
    initAudio();

    noteIndex = 0;
    bgMusicTimer = setInterval(() => {
        if (!isMusicPlaying || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(bgNotes[noteIndex], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.28);

        noteIndex = (noteIndex + 1) % bgNotes.length;
    }, 300);
}

function stopBgMusic() {
    if (!isMusicPlaying) return;
    isMusicPlaying = false;
    if (bgMusicTimer) {
        clearInterval(bgMusicTimer);
        bgMusicTimer = null;
    }
}

function startBattleMusic() {
    if (isBattleMusicPlaying) return;
    stopBgMusic();
    isBattleMusicPlaying = true;
    initAudio();

    battleNoteIndex = 0;
    battleMusicTimer = setInterval(() => {
        if (!isBattleMusicPlaying || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth'; 
        osc.frequency.setValueAtTime(battleNotes[battleNoteIndex], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.18, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);

        battleNoteIndex = (battleNoteIndex + 1) % battleNotes.length;
    }, 180);
}

function stopBattleMusic() {
    if (!isBattleMusicPlaying) return;
    isBattleMusicPlaying = false;
    if (battleMusicTimer) {
        clearInterval(battleMusicTimer);
        battleMusicTimer = null;
    }
}

function updateBgMusicState() {
    const isMenuArea = (gameState === 'start' || gameState === 'level_select' || gameState === 'other_modes');

    if (isMenuArea) {
        startBgMusic();
    } else if (gameState === 'playing') {
        startBattleMusic();
    } else {
        stopBgMusic();
        stopBattleMusic();
    }
}

function playWinSound() {
    initAudio();
    stopBgMusic();
    stopBattleMusic();
    
    const winNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; 
    winNotes.forEach((freq, idx) => {
        setTimeout(() => {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.25, audioCtx.currentTime); 
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        }, idx * 100);
    });
}

function playGameOverSound() {
    initAudio();
    stopBgMusic();
    stopBattleMusic();

    const loseNotes = [400, 320, 250, 180, 120]; 
    loseNotes.forEach((freq, idx) => {
        setTimeout(() => {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime); 
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        }, idx * 140);
    });
}