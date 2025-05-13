let questions = [
  { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
  { question: "Who wrote the famous novel 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Jane Austen", "Ernest Hemingway"], answer: "Harper Lee" },
  { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Silver", "Iron"], answer: "Oxygen" },
  { question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "In which year did World War II end?", options: ["1945", "1939", "1942", "1950"], answer: "1945" },
  { question: "Who painted the ceiling of the Sistine Chapel?", options: ["Michelangelo", "Da Vinci", "Raphael", "Donatello"], answer: "Michelangelo" },
  { question: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
  { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"], answer: "Blue Whale" },
  { question: "Which country is home to the kangaroo?", options: ["Australia", "India", "South Africa", "Canada"], answer: "Australia" },
  { question: "What is the hardest natural substance on Earth?", options: ["Diamond", "Gold", "Iron", "Quartz"], answer: "Diamond" },
  { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: "8" },
  { question: "What is the smallest prime number?", options: ["1", "2", "3", "5"], answer: "2" },
  { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
  { question: "Which language has the most native speakers?", options: ["English", "Spanish", "Mandarin", "Hindi"], answer: "Mandarin" },
  { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Nikola Tesla"], answer: "Albert Einstein" },
  { question: "What is the currency of Japan?", options: ["Yen", "Won", "Dollar", "Ruble"], answer: "Yen" },
  { question: "How many bones are in the adult human body?", options: ["206", "208", "210", "212"], answer: "206" },
  { question: "Which sport is known as the 'king of sports'?", options: ["Basketball", "Cricket", "Football", "Tennis"], answer: "Football" },
  { question: "Who is the author of '1984'?", options: ["George Orwell", "J.K. Rowling", "Aldous Huxley", "Mark Twain"], answer: "George Orwell" },
  { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" }
];

let shuffledQuestions = [];
let currentPlayer = 1;
let lives = { 1: 3, 2: 3 };
let scores = { 1: 0, 2: 0 };
let playerNames = { 1: "Player 1", 2: "Player 2" };
let timerInterval;
let timeLeft = 30;
let defenseMode = false;
let attacker;
let currentQuestionIndex = 0;

const turnIndicator = document.getElementById("turn-indicator");
const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");
const defenseDisplay = document.getElementById("defense-mode");

function startGame() {
  const p1 = document.getElementById("player1-name").value || "Player 1";
  const p2 = document.getElementById("player2-name").value || "Player 2";
  playerNames[1] = p1;
  playerNames[2] = p2;
  document.getElementById("name1").textContent = p1;
  document.getElementById("name2").textContent = p2;
  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");

  shuffledQuestions = questions.sort(() => 0.5 - Math.random());
  currentQuestionIndex = 0;

  updateDisplay(); // Show initial hearts and scores
  loadQuestion();
}

function loadQuestion() {
  timeLeft = 10;
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(countdown, 1000);

  const q = shuffledQuestions[currentQuestionIndex++];
  questionBox.textContent = q.question;
  optionsBox.innerHTML = "";
  feedback.textContent = "";
  nextBtn.disabled = true;
  updateDefenseIndicator();

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => handleAnswer(btn, option, q.answer);
    optionsBox.appendChild(btn);
  });
}

function countdown() {
  timeLeft--;
  updateTimer();
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    feedback.textContent = "Time's up! Wrong answer.";
    applyWrongAnswer();
    nextBtn.disabled = false;
    disableOptions();
  }
}

function updateTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  turnIndicator.textContent = `${playerNames[currentPlayer]}'s Turn`;
}

function handleAnswer(selectedBtn, selected, correct) {
  clearInterval(timerInterval);
  disableOptions();

  if (defenseMode) {
    if (selected === correct) {
      feedback.textContent = `${playerNames[currentPlayer]} successfully defended!`;
    } else {
      feedback.textContent = `${playerNames[currentPlayer]}'s defense failed!`;
      lives[currentPlayer] = 0;
    }
    defenseMode = false;
    updateDefenseIndicator();
    updateDisplay();
    nextBtn.disabled = false;
    return;
  }

  if (selected === correct) {
    scores[currentPlayer]++;
    selectedBtn.style.backgroundColor = "green";
    let opponent = currentPlayer === 1 ? 2 : 1;

    if (lives[opponent] === 1) {
      feedback.textContent = `Defense Mode: ${playerNames[opponent]} is attempting to block the attack!`;
      attacker = currentPlayer;
      currentPlayer = opponent;
      defenseMode = true;
      updateDefenseIndicator();
      setTimeout(loadQuestion, 1500);
      return;
    } else {
      lives[opponent]--;
      feedback.textContent = `Correct! ${playerNames[opponent]} loses a heart.`;
    }
  } else {
    selectedBtn.style.backgroundColor = "red";
    feedback.textContent = "Wrong answer! You lose a heart.";
    lives[currentPlayer]--;
  }

  updateDisplay();
  checkGameOver();
  nextBtn.disabled = false;
}

function applyWrongAnswer() {
  if (defenseMode) {
    feedback.textContent = `${playerNames[currentPlayer]}'s defense failed!`;
    lives[currentPlayer] = 0;
    defenseMode = false;
  } else {
    lives[currentPlayer]--;
  }
  updateDefenseIndicator();
  updateDisplay();
  checkGameOver();
}

function disableOptions() {
  Array.from(optionsBox.children).forEach(btn => btn.disabled = true);
}

function updateDisplay() {
  function renderHearts(player) {
    const heartsContainer = document.getElementById(`hearts${player}`);
    heartsContainer.innerHTML = "❤️".repeat(lives[player]);
  }
  renderHearts(1);
  renderHearts(2);
  document.getElementById("score1").textContent = scores[1];
  document.getElementById("score2").textContent = scores[2];
}

function checkGameOver() {
  if (lives[1] === 0 || lives[2] === 0) {
    turnIndicator.textContent = "Game Over!";
    feedback.textContent += ` ${lives[1] === 0 ? playerNames[2] : playerNames[1]} wins!`;
    clearInterval(timerInterval);
    disableOptions();
    nextBtn.style.display = "none";
  }
}
function goHome() {
  window.location.href = "index.html"; // Replace with the actual homepage path
}


function updateDefenseIndicator() {
  if (defenseMode) {
    defenseDisplay.textContent = `${playerNames[currentPlayer]} is in Defense Mode!`;
  } else {
    defenseDisplay.textContent = "";
  }
}

nextBtn.onclick = () => {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  loadQuestion();
};
