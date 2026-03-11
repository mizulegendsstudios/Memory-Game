// Clase principal del juego de memoria
function MemoryGame() {
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.gameContainer = document.getElementById('game-container');
    this.movesCount = document.getElementById('moves-count');
    this.timeDisplay = document.getElementById('time');
    this.restartButton = document.getElementById('restart');
    this.audioContext = null;
    this.sounds = {};
    
    this.initialize();
}

MemoryGame.prototype.initialize = function() {
    this.createAudioContext();
    this.createSounds();
    this.createCards();
    this.renderCards();
    this.setupEventListeners();
    this.startTimer();
};

MemoryGame.prototype.createAudioContext = function() {
    // Crear contexto de audio para generar sonidos
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
};

MemoryGame.prototype.createSounds = function() {
    // Sonido al voltear carta
    this.sounds.flip = this.createSound(200, 0.1, 'sine');
    
    // Sonido al emparejar
    this.sounds.match = this.createSound(800, 0.2, 'sine');
    
    // Sonido de error
    this.sounds.error = this.createSound(100, 0.15, 'sawtooth');
};

MemoryGame.prototype.createSound = function(frequency, duration, type) {
    return function() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }.bind(this);
};

MemoryGame.prototype.createCards = function() {
    // Emojis para las cartas
    const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎬', '🎭'];
    const cardPairs = [...emojis, ...emojis]; // Duplicar para pares
    
    // Mezclar las cartas
    this.cards = this.shuffleArray(cardPairs);
};

MemoryGame.prototype.shuffleArray = function(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

MemoryGame.prototype.renderCards = function() {
    this.gameContainer.innerHTML = '';
    
    this.cards.forEach((emoji, index) => {
        const card = this.createCardElement(emoji, index);
        this.gameContainer.appendChild(card);
    });
};

MemoryGame.prototype.createCardElement = function(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-front">
            <span class="card-emoji">${emoji}</span>
        </div>
        <div class="card-back"></div>
    `;
    
    return card;
};

MemoryGame.prototype.setupEventListeners = function() {
    this.gameContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
            this.flipCard(card);
        }
    });
    
    this.restartButton.addEventListener('click', () => {
        this.restartGame();
    });
};

MemoryGame.prototype.flipCard = function(card) {
    // Reproducir sonido de volteo
    this.sounds.flip();
    
    card.classList.add('flipped');
    this.flippedCards.push(card);
    
    if (this.flippedCards.length === 2) {
        this.moves++;
        this.movesCount.textContent = this.moves;
        this.checkMatch();
    }
};

MemoryGame.prototype.checkMatch = function() {
    const [card1, card2] = this.flippedCards;
    const emoji1 = card1.querySelector('.card-emoji').textContent;
    const emoji2 = card2.querySelector('.card-emoji').textContent;
    
    if (emoji1 === emoji2) {
        this.handleMatch(card1, card2);
    } else {
        this.handleMismatch(card1, card2);
    }
    
    this.flippedCards = [];
};

MemoryGame.prototype.handleMatch = function(card1, card2) {
    // Reproducir sonido de emparejamiento
    this.sounds.match();
    
    setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Verificar si el juego ha terminado
        if (document.querySelectorAll('.matched').length === this.cards.length) {
            this.endGame();
        }
    }, 300);
};

MemoryGame.prototype.handleMismatch = function(card1, card2) {
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }, 1000);
};

MemoryGame.prototype.startTimer = function() {
    this.timerInterval = setInterval(() => {
        this.timer++;
        this.updateTimerDisplay();
    }, 1000);
};

MemoryGame.prototype.updateTimerDisplay = function() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

MemoryGame.prototype.endGame = function() {
    clearInterval(this.timerInterval);
    
    // Reproducir sonido de victoria
    this.createVictorySound();
    
    setTimeout(() => {
        alert(`¡Felicidades! Completaste el juego en ${this.moves} movimientos y ${this.timeDisplay.textContent}`);
    }, 500);
};

MemoryGame.prototype.createVictorySound = function() {
    const notes = [523, 659, 784, 1047]; // Do, Mi, Sol, Do alto
    notes.forEach((frequency, index) => {
        setTimeout(() => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        }, index * 150);
    });
};

MemoryGame.prototype.restartGame = function() {
    clearInterval(this.timerInterval);
    this.moves = 0;
    this.timer = 0;
    this.flippedCards = [];
    this.movesCount.textContent = '0';
    this.timeDisplay.textContent = '00:00';
    
    this.initialize();
};

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
