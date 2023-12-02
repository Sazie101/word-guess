'use strict';

import { onEvent, select, selectById, selectAll, print } from "./utility.js";

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

const shuffledWords = shuffleArray(words);
const wordDisplay = select('.word-display');
const userInput = select('.user-input');
const scoreDisplay = select('.score');
const timerDisplay = select('.timer');
const startBtn = select('.startBtn');
const countDown = select('.countDown');
const startPage = select('.startPage');
const everything = select('.everything');
const countdownSound = selectById('countdownSound');
const correctAnswer = selectById('correctAnswer');
const tickingClock = selectById('tickingClock');

let score = 0;
let timer = 99;

function startCounDown() {
    countDown.innerText = '3';
    setTimeout(() => {
        countDown.innerText = '2';
        setTimeout(() => {
            countDown.innerText = '1';
            setTimeout(() => {
                countDown.innerText = '';
                everything.style.display = 'block';
                userInput.focus();
                startPage.style.display = 'none';
                startGame();
            }, 1000);
        }, 1000);
    }, 1000);
}

function startGame() {
    function updateWord() {
        if (shuffledWords.length > 0) {
            const currentWord = shuffledWords.pop();
            wordDisplay.innerText = currentWord;
            userInput.value = ''; 
        } else {
            endGame();
        }
    }
    
    function updateScore() {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    }
    
    function updateTimer() {
        timer--;
        timerDisplay.innerText = `Time remaining: ${timer}s`;

        if (timer <= 60) {
            timerDisplay.style.color = '#ffff00';
        } 
        
        if (timer <= 20) {
            timerDisplay.style.color = '#ff0000';
            timerDisplay.classList.add('flash');
            tickingClock.play();
        }
    
        if (timer === 0) {
            tickingClock.pause();
            timerDisplay.classList.remove('flash');
            endGame();
        }
    }

    updateWord();

    function endGame() {
        wordDisplay.innerText = 'Game Over!';
        userInput.disabled = true;
        clearInterval(gameInterval);
    }
    
    onEvent('input', userInput, () => {
        if (userInput.value.trim() === wordDisplay.innerText) {
            correctAnswer.play();
            updateScore();
            updateWord();
        }
    });

    const gameInterval = setInterval(updateTimer, 1000);
}

onEvent('click', startBtn, () => {
    startBtn.style.display = 'none';
    countdownSound.play();
    startCounDown();
});