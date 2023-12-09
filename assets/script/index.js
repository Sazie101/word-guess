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

let shuffledWords = shuffleArray(words);
const wordDisplay = select('.word-display');
const userInput = select('.user-input');
const scoreDisplay = select('.score');
const timerDisplay = select('.timer');
const startBtn = select('.startBtn');
const resetBtn = select('.reset');
const countDown = select('.countDown');
const startPage = select('.startPage');
const everything = select('.everything');
const countdownSound = selectById('countdownSound');
const correctAnswer = selectById('correctAnswer');
const tickingClock = selectById('tickingClock');
const gameSound = selectById('gameSound');
const scoreTable = select('.scoreTable');
let gameInterval; 
let score = 0;
let timer = 20;

let scoresArray = JSON.parse(localStorage.getItem('scores')) || [];

function highScore() {
    const scoreboard = select('.scoreboard');
    scoreboard.innerHTML = '';

    if (scoresArray.length > 0) {
        scoresArray.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.innerText = `#${index + 1}: ${score.hits} words ${score.percentage}%`;
            scoreboard.appendChild(listItem);
        });
    } else {
        const message = document.createElement('p');
        message.innerText = 'No games have been played.';
        scoreboard.appendChild(message);
    }
}

function startCountDown() {
    let countdownValue = 3;

    const countdownInterval = setInterval(() => {
        countdownSound.play();
        if (countdownValue > 0) {
            countDown.innerText = countdownValue;
            countdownValue--;
        } else {
            gameSound.play();
            gameSound.volume = 0.8;
            countDown.innerText = '';
            clearInterval(countdownInterval);
            everything.style.display = 'block';
            userInput.focus();
            startPage.style.display = 'none';

            function updateWord() {
                if (shuffledWords.length > 0) {
                    const currentWord = shuffledWords.pop();
                    wordDisplay.innerText = currentWord;
                    userInput.value = ''; 
                    highlightLetters();
                } else {
                    endGame();
                }
            }

            function updateScore() {
                score++;
                scoreDisplay.innerText = `Hits: ${score}`;
                scoreDisplay.classList.add('score-animation');
                setTimeout(() => {
                    scoreDisplay.classList.remove('score-animation');
                }, 500);
            }

            function updateTimer() {
                timer--;
                timerDisplay.innerText = `Time: ${timer}s`;

                if (timer <= 10) {
                    gameSound.volume = 0.6;
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
                gameSound.pause();
                wordDisplay.innerText = 'Game Over!';
                userInput.disabled = true;
                scoreTable.style.display = 'block';

                const gameData = {
                    hits: 0,
                    percentage: 0,
                };

                gameData.hits = score;
                gameData.percentage = ((score / words.length) * 100).toFixed(2);
                scoresArray.push(gameData);

                scoresArray.sort((a, b) => b.hits - a.hits);
                scoresArray.splice(10);

                localStorage.setItem('scores', JSON.stringify(scoresArray));

                highScore();
                
                clearInterval(gameInterval);
            }
            
            function highlightLetters() {
                const word = wordDisplay.innerText;
                const letters = word.split('');
                const inputLetters = userInput.value.split('');
                const input = userInput.value.toLowerCase();
                let highlightedWord = '';
            
                letters.forEach((letter, index) => {
                    if (letter === inputLetters[index]) {
                        highlightedWord += `<span class="highlight">${letter}</span>`;
                    } else {
                        highlightedWord += letter;
                    }
                });
            
                wordDisplay.innerHTML = highlightedWord;
            }

            onEvent('input', userInput, () => {
                if (userInput.value.trim() === wordDisplay.innerText) {
                    correctAnswer.play();
                    updateScore();
                    updateWord();
                } else {
                    highlightLetters();
                }
            });

            gameInterval = setInterval(updateTimer, 1000); 
        }
    }, 1000);
}

function resetGame() {
    gameSound.pause();
    gameSound.volume = 0.8;
    scoreTable.style.display = 'none';
    shuffledWords = shuffleArray(words.slice()); 
    wordDisplay.innerText = '';
    userInput.value = '';
    score = 0;
    timer = 20;
    scoreDisplay.innerText = 'Score: 0';
    timerDisplay.innerText = 'Time : 20s';
    everything.style.display = 'none';
    startPage.style.display = 'block';
    timerDisplay.style.color = '#ffff00';
    timerDisplay.classList.remove('flash');
    tickingClock.pause();
    timerDisplay.style.color = '';
    userInput.disabled = false;
    clearInterval(gameInterval);
    tickingClock.pause();
    startCountDown();
}

onEvent('load', window, () => {
    everything.style.display = 'none';
});

onEvent('click', startBtn, () => {
    score = 0;
    timer = 20;
    startBtn.style.display = 'none';
    startCountDown();
});

onEvent('click', resetBtn, () => {
    resetGame();
});
