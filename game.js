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
    
    this.initialize();
}

MemoryGame.prototype.initialize = function() {
    this.createCards();
    this.renderCards();
    this.setupEventListeners();
    this.startTimer();
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
        <div class="card-front">${emoji}</div>
        <div class="card-back">?</div>
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
    const emoji1 = card1.querySelector('.card-front').textContent;
    const emoji2 = card2.querySelector('.card-front').textContent;
    
    if (emoji1 === emoji2) {
        this.handleMatch(card1, card2);
    } else {
        this.handleMismatch(card1, card2);
    }
    
    this.flippedCards = [];
};

MemoryGame.prototype.handleMatch = function(card1, card2) {
    setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Verificar si el juego ha terminado
        if (document.querySelectorAll('.matched').length === this.cards.length) {
            this.endGame();
        }
    }, 500);
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
    
    setTimeout(() => {
        alert(`¡Felicidades! Completaste el juego en ${this.moves} movimientos y ${this.timeDisplay.textContent}`);
    }, 500);
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
