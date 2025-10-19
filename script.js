/*
 * Lógica principal del juego de Comparativos y Superlativos
 * Controla el flujo del juego, interacciones del usuario y estado del juego
 */

// Variables globales del juego
let currentQuestion = 0;        // Índice de la pregunta actual
let score = 0;                  // Puntuación del jugador
let lives = 3;                  // Vidas restantes
let streak = 0;                 // Racha de respuestas correctas
let perfectAnswers = 0;         // Número de rachas de 5 respuestas correctas
let answersLog = [];            // Registro de todas las respuestas
let startTime;                  // Tiempo de inicio del juego
let timerInterval;              // Referencia al intervalo del temporizador
let selectedAnswer = null;      // Respuesta seleccionada actualmente
let filteredQuestions = [];     // Preguntas filtradas según dificultad/categoría
let currentDifficulty = "all";  // Dificultad actual seleccionada
let currentCategory = "all";    // Categoría actual seleccionada

// Variables para el temporizador por pregunta y rachas
let questionStartTime;
let questionTimes = [];

// Variables para funcionalidad online
let isOnline = false;
let playerName = "";
let leaderboard = [];
let onlineQuestions = [];
// Referencias a elementos del DOM
const questionContainer = document.getElementById("question-container");
const doorsContainer = document.getElementById("doors-container");
const feedback = document.getElementById("feedback");
const explanation = document.getElementById("explanation");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const skipBtn = document.getElementById("skip-btn");
const hintBtn = document.getElementById("hint-btn");
const restartBtn = document.getElementById("restart-btn");
const summary = document.getElementById("summary");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const timer = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const streakDisplay = document.getElementById("streak");
const perfectDisplay = document.getElementById("perfect");
const hintDisplay = document.getElementById("hint");
const celebration = document.getElementById("celebration");
const difficultySelector = document.getElementById("difficulty-selector");
const categorySelector = document.getElementById("category-selector");

/**
 * Inicia el temporizador del juego
 */
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((new Date() - startTime) / 1000);
    timer.textContent = `⏱️ Tiempo: ${elapsed}s`;
  }, 1000);
}

/**
 * Detiene el temporizador del juego
 */
function stopTimer() {
  clearInterval(timerInterval);
}

/**
 * Actualiza la barra de progreso según la pregunta actual
 */
function updateProgress() {
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `Pregunta ${currentQuestion + 1} de ${filteredQuestions.length}`;
}

/**
 * Actualiza todas las estadísticas en pantalla
 */
function updateStats() {
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  streakDisplay.textContent = streak;
  perfectDisplay.textContent = perfectAnswers;
}

/**
 * Filtra las preguntas según la dificultad y categoría seleccionadas
 */
function filterQuestions() {
  filteredQuestions = questions.filter(q => {
    const difficultyMatch = currentDifficulty === "all" || q.difficulty === currentDifficulty;
    const categoryMatch = currentCategory === "all" || q.category === currentCategory;
    return difficultyMatch && categoryMatch;
  });
  
  // Barajar las preguntas filtradas
  filteredQuestions = filteredQuestions.sort(() => 0.5 - Math.random());
  
  // Reiniciar el juego si no hay preguntas
  if (filteredQuestions.length === 0) {
    alert("No hay preguntas con los filtros seleccionados. Se mostrarán todas las preguntas.");
    currentDifficulty = "all";
    currentCategory = "all";
    document.querySelectorAll('.difficulty-btn, .category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('.difficulty-btn[data-difficulty="all"]').classList.add('active');
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    filterQuestions();
    return;
  }
  
  // Reiniciar variables del juego
  currentQuestion = 0;
  score = 0;
  lives = 3;
  streak = 0;
  perfectAnswers = 0;
  answersLog = [];
  selectedAnswer = null;
  questionTimes = [];
  
  loadQuestion();
  updateStats();
}

/**
 * Carga la pregunta actual en la interfaz
 */
function loadQuestion() {
  const q = filteredQuestions[currentQuestion];
  questionContainer.textContent = q.question;
  hintDisplay.textContent = "";
  explanation.classList.remove("show");
  
  // Reiniciar estado de la interfaz
  selectedAnswer = null;
  feedback.textContent = "";
  feedback.className = "feedback";
  
  // INICIA EL TEMPORIZADOR DE LA PREGUNTA ACTUAL
  questionStartTime = new Date();
  
  // Actualizar estado de los botones de navegación
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === filteredQuestions.length - 1 ? "Finalizar 🏁" : "Siguiente ➡️";
  
  // Barajar opciones de respuesta
  const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());

  // Crear elementos de puerta para cada opción
  doorsContainer.innerHTML = "";
  shuffledOptions.forEach(option => {
    const door = document.createElement("div");
    door.classList.add("door");
    door.textContent = option;
    door.addEventListener("click", () => checkAnswer(option, door));
    doorsContainer.appendChild(door);
  });

  updateProgress();
  updateStats();
}

/**
 * Verifica si la respuesta seleccionada es correcta
 * @param {string} selected - Respuesta seleccionada por el usuario
 * @param {HTMLElement} doorElement - Elemento DOM de la puerta seleccionada
 */
function checkAnswer(selected, doorElement) {
  if (selectedAnswer !== null) return; // Evitar múltiples selecciones
  
  selectedAnswer = selected;
  const q = filteredQuestions[currentQuestion];
  const isCorrect = selected === q.answer;
  
  // CALCULAR TIEMPO DE RESPUESTA Y GUARDARLO
  const questionEndTime = new Date();
  const timeTaken = (questionEndTime - questionStartTime) / 1000; // en segundos
  questionTimes[currentQuestion] = timeTaken;
  
  // Deshabilitar todas las puertas
  document.querySelectorAll('.door').forEach(door => {
    door.classList.add('disabled');
    door.style.cursor = 'not-allowed';
    
    // Marcar respuesta correcta e incorrecta visualmente
    if (door.textContent === q.answer) {
      door.classList.add('correct');
    } else if (door === doorElement && !isCorrect) {
      door.classList.add('incorrect');
    }
  });

  // Procesar respuesta correcta
  if (isCorrect) {
    // BONUS POR RAPIDEZ (máximo 5 puntos extra por respuesta rápida)
    let speedBonus = 0;
    if (timeTaken < 5) {
      speedBonus = 5;
    } else if (timeTaken < 10) {
      speedBonus = 3;
    } else if (timeTaken < 15) {
      speedBonus = 1;
    }
    
    feedback.textContent = "✅ ¡Correcto!";
    if (speedBonus > 0) {
      feedback.textContent += ` ⚡ +${speedBonus} puntos por rapidez!`;
    }
    feedback.classList.add("correct-feedback");
    
    score += 10 + speedBonus;
    streak++;
    
    if (streak > 1) {
      const streakBonus = calculateStreakBonus(streak);
      feedback.textContent += ` 🔥 Racha de ${streak}! +${streakBonus} puntos!`;
      score += streakBonus;
      
      // RECOMPENSAS ESPECIALES POR RACHAS ALTAS
      if (streak === 5) {
        lives++; // Vida extra al alcanzar racha de 5
        feedback.textContent += " 💖 ¡Vida extra!";
        perfectAnswers++;
        createConfetti();
      } else if (streak === 10) {
        lives += 2; // Dos vidas extras al alcanzar racha de 10
        feedback.textContent += " 💖💖 ¡Dos vidas extras!";
        createConfetti();
      }
    }
  } 
  // Procesar respuesta incorrecta
  else {
    feedback.textContent = `❌ Incorrecto. La respuesta correcta es: ${q.answer}`;
    feedback.classList.add("incorrect-feedback");
    lives--;
    streak = 0;
    
    // Verificar si se acabaron las vidas
    if (lives <= 0) {
      setTimeout(() => {
        feedback.textContent += " ❌ ¡Te has quedado sin vidas!";
        setTimeout(showSummary, 1500);
      }, 1000);
    }
  }

  // Mostrar explicación de la respuesta
  explanation.textContent = q.explanation;
  explanation.classList.add("show");

  // Registrar la respuesta
  answersLog[currentQuestion] = { 
    question: q.question, 
    selected, 
    correct: q.answer,
    isCorrect,
    explanation: q.explanation,
    timeTaken: timeTaken // GUARDAR TIEMPO EN EL REGISTRO
  };
  
  updateStats();
}

/**
 * Calcula el bonus de puntos según la racha actual
 * @param {number} streak - Racha actual de respuestas correctas
 * @returns {number} Puntos de bonus
 */
function calculateStreakBonus(streak) {
  // Bonus progresivo: más puntos cuanto mayor sea la racha
  if (streak >= 10) return 15;
  if (streak >= 7) return 10;
  if (streak >= 5) return 7;
  if (streak >= 3) return 5;
  return 3; // Bonus base para rachas de 2
}

/**
 * Avanza a la siguiente pregunta
 */
function nextQuestion() {
  // Si no se ha respondido, contar como saltada
  if (selectedAnswer === null && answersLog[currentQuestion] === undefined) {
    answersLog[currentQuestion] = { 
      question: filteredQuestions[currentQuestion].question, 
      selected: null, 
      correct: filteredQuestions[currentQuestion].answer,
      isCorrect: false,
      skipped: true,
      explanation: filteredQuestions[currentQuestion].explanation
    };
    streak = 0;
    updateStats();
  }
  
  currentQuestion++;
  if (currentQuestion < filteredQuestions.length && lives > 0) {
    loadQuestion();
  } else {
    showSummary();
  }
}

/**
 * Retrocede a la pregunta anterior
 */
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
    
    // Restaurar respuesta anterior si existe
    if (answersLog[currentQuestion]) {
      const prevAnswer = answersLog[currentQuestion];
      selectedAnswer = prevAnswer.selected;
      
      if (selectedAnswer !== null) {
        document.querySelectorAll('.door').forEach(door => {
          door.classList.add('disabled');
          door.style.cursor = 'not-allowed';
          
          // Restaurar estado visual de las puertas
          if (door.textContent === prevAnswer.correct) {
            door.classList.add('correct');
          } else if (door.textContent === prevAnswer.selected && !prevAnswer.isCorrect) {
            door.classList.add('incorrect');
          }
        });
        
        // Restaurar retroalimentación
        if (prevAnswer.isCorrect) {
          feedback.textContent = "✅ ¡Correcto!";
          feedback.classList.add("correct-feedback");
        } else {
          feedback.textContent = `❌ Incorrecto. La respuesta correcta es: ${prevAnswer.correct}`;
          feedback.classList.add("incorrect-feedback");
        }
        
        // Restaurar explicación
        explanation.textContent = prevAnswer.explanation;
        explanation.classList.add("show");
      }
    }
  }
}

/**
 * Muestra una pista para la pregunta actual
 */
function showHint() {
  const q = filteredQuestions[currentQuestion];
  const correctAnswer = q.answer;
  
  // Generar pista según el tipo de respuesta
  let hint = "";
  if (correctAnswer.includes("er") && !correctAnswer.includes("ier")) {
    hint = "Pista: La respuesta correcta termina en 'er'";
  } else if (correctAnswer.includes("est")) {
    hint = "Pista: La respuesta correcta termina en 'est'";
  } else if (correctAnswer.startsWith("More ")) {
    hint = "Pista: La respuesta correcta empieza con 'More'";
  } else if (correctAnswer.startsWith("Most ")) {
    hint = "Pista: La respuesta correcta empieza con 'Most'";
  } else {
    hint = "Pista: Es una forma irregular";
  }
  
  hintDisplay.textContent = hint;
  score -= 2; // Penalización por usar pista
  if (score < 0) score = 0;
  updateStats();
}

/**
 * Muestra el resumen final del juego
 */
function showSummary() {
  stopTimer();
  
  // Ocultar elementos del juego
  questionContainer.classList.add("hidden");
  doorsContainer.classList.add("hidden");
  feedback.classList.add("hidden");
  explanation.classList.add("hidden");
  nextBtn.classList.add("hidden");
  prevBtn.classList.add("hidden");
  skipBtn.classList.add("hidden");
  hintBtn.classList.add("hidden");
  timer.classList.add("hidden");
  difficultySelector.classList.add("hidden");
  categorySelector.classList.add("hidden");
  document.querySelector(".stats-container").classList.add("hidden");
  document.querySelector(".progress-container").classList.add("hidden");
  document.querySelector(".progress-text").classList.add("hidden");

  // Calcular estadísticas finales
  const correctAnswers = answersLog.filter(log => log.isCorrect).length;
  const totalQuestions = filteredQuestions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // OBTENER ESTADÍSTICAS DE TIEMPO
  const timeStats = calculateTimeStats();
  
  let emoji = "";
  let message = "";
  
  if (percentage >= 90) {
    emoji = "🎉";
    message = "Excellent! You are an expert in comparatives and superlatives.";
    createConfetti();
  } else if (percentage >= 70) {
    emoji = "👍";
    message = "Very good! You have a good knowledge of comparatives and superlatives.";
  } else if (percentage >= 50) {
    emoji = "😊";
    message = "Good work, but you can improve. Keep practicing.";
  } else {
    emoji = "📚";
    message = "Keep studying. Practice makes perfect!";
  }

  // GUARDAR PUNTUACIÓN EN SERVIDOR SI ESTÁ ONLINE
  let savePromise = Promise.resolve(false);
  if (isOnline && playerName) {
    savePromise = saveScoreToServer();
  }

  // Mostrar resumen
  summary.classList.remove("hidden");
  
  // Usar una función async para manejar el guardado
  (async () => {
    const scoreSaved = await savePromise;
    
    const onlineButtons = isOnline ? `
      <button id="view-online-ranking">🏆 View Global Ranking</button>
      ${scoreSaved ? '<p class="save-success">✅ Score saved online!</p>' : ''}
    ` : '';
    
    summary.innerHTML = `
      <h2>Final Results</h2>
      ${isOnline && playerName ? `<p>Player: <strong>${playerName}</strong></p>` : ''}
      <div class="score-emoji">${emoji}</div>
      <div class="score-display">${correctAnswers}/${totalQuestions} (${percentage}%)</div>
      <p>${message}</p>
      <p><strong>Total score:</strong> ${score} points</p>
      <p><strong>Perfect streaks:</strong> ${perfectAnswers}</p>
      ${timeStats}
      ${onlineButtons}
      <h3>Answer details:</h3>
      <ul>
        ${answersLog.map((log, index) => `
          <li class="${log.skipped ? 'skipped' : (log.isCorrect ? 'correct' : 'incorrect')}">
            <strong>Question ${index + 1}: ${log.question}</strong><br>
            Your answer: ${log.selected || (log.skipped ? "⏭️ Skipped" : "Not answered")} <br>
            Correct answer: ${log.correct} <br>
            Time: ${log.timeTaken ? log.timeTaken.toFixed(1) + 's' : 'N/A'}<br>
            ${log.explanation ? `<em>Explanation: ${log.explanation}</em>` : ''}
          </li>
        `).join("")}
      </ul>
      <button id="restart-btn">🔄 Play Again</button>
    `;
    
    document.getElementById("restart-btn").addEventListener("click", restartGame);
    
    // Añadir evento para el botón de ranking online
    if (isOnline) {
      document.getElementById("view-online-ranking").addEventListener("click", showLeaderboard);
    }
  })();
}

/**
 * Calcula y muestra estadísticas de tiempo
 */
function calculateTimeStats() {
  if (questionTimes.length === 0) return "";
  
  const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / questionTimes.length;
  const fastestTime = Math.min(...questionTimes.filter(time => time > 0));
  const slowestTime = Math.max(...questionTimes);
  
  return `
    <p><strong>Tiempo total:</strong> ${totalTime.toFixed(1)} segundos</p>
    <p><strong>Tiempo promedio por pregunta:</strong> ${averageTime.toFixed(1)} segundos</p>
    <p><strong>Respuesta más rápida:</strong> ${fastestTime.toFixed(1)} segundos</p>
    <p><strong>Respuesta más lenta:</strong> ${slowestTime.toFixed(1)} segundos</p>
  `;
}
/**
 * Reinicia el juego a su estado inicial
 */
function restartGame() {
  // Reiniciar variables del juego
  currentQuestion = 0;
  score = 0;
  lives = 3;
  streak = 0;
  perfectAnswers = 0;
  answersLog = [];
  selectedAnswer = null;
  questionTimes = [];
  
  // Mostrar elementos del juego
  questionContainer.classList.remove("hidden");
  doorsContainer.classList.remove("hidden");
  feedback.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
  prevBtn.classList.remove("hidden");
  skipBtn.classList.remove("hidden");
  hintBtn.classList.remove("hidden");
  timer.classList.remove("hidden");
  difficultySelector.classList.remove("hidden");
  categorySelector.classList.remove("hidden");
  document.querySelector(".stats-container").classList.remove("hidden");
  document.querySelector(".progress-container").classList.remove("hidden");
  document.querySelector(".progress-text").classList.remove("hidden");
  summary.classList.add("hidden");
  
  // Reiniciar temporizador
  startTimer();
  
  // Cargar primera pregunta
  filterQuestions();
}

/**
 * Crea efecto de confeti para celebraciones
 */
function createConfetti() {
  celebration.style.display = "block";
  celebration.innerHTML = "";
  
  // Crear múltiples partículas de confeti
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 5 + "s";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = Math.random() * 10 + 5 + "px";
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
    celebration.appendChild(confetti);
  }
  
  setTimeout(() => {
    celebration.style.display = "none";
  }, 5000);
}
/**
 * Verifica si hay conexión a internet y carga preguntas del servidor
 */
async function initializeOnlineFeatures() {
  try {
    console.log('🔄 Intentando conectar con el servidor...');
    
    const response = await fetch('/api/questions');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const onlineQuestions = await response.json();
    console.log('✅ Servidor respondió con', onlineQuestions.length, 'preguntas');
    
    // Convertir formato de preguntas online al formato local
    if (onlineQuestions && onlineQuestions.length > 0) {
      questions = onlineQuestions.map(q => ({
        question: q.question,
        options: [q.option1, q.option2, q.option3],
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category
      }));
      
      isOnline = true;
      updateOnlineStatus(true);
      console.log('✅ Online mode activated - Questions loaded from server');
      
      // Mostrar características online
      showOnlineFeatures();
    } else {
      throw new Error('No questions received from server');
    }
    
  } catch (error) {
    console.log('🔴 Offline mode - Using local questions. Error:', error.message);
    isOnline = false;
    updateOnlineStatus(false);
    // Asegurarnos de que el juego funcione con preguntas locales
    if (questions.length === 0) {
      console.error('No hay preguntas disponibles');
      return;
    }
  }
}

/**
 * Actualiza el indicador de estado online/offline
 */
function updateOnlineStatus(online) {
  const statusElement = document.getElementById('online-status');
  if (online) {
    statusElement.textContent = '🟢 Online';
    statusElement.className = 'online-status online';
  } else {
    statusElement.textContent = '🔴 Offline';
    statusElement.className = 'online-status offline';
  }
}

/**
 * Muestra características online en la interfaz
 */
function showOnlineFeatures() {
  // Mostrar configuración de jugador
  document.getElementById('player-setup').classList.remove('hidden');
  
  // Mostrar botón de ranking
  document.getElementById('leaderboard-btn').classList.remove('hidden');
  
  // Event listeners para características online
  document.getElementById('save-name-btn').addEventListener('click', savePlayerName);
  document.getElementById('leaderboard-btn').addEventListener('click', showLeaderboard);
}

/**
 * Guarda el nombre del jugador
 */
function savePlayerName() {
  const nameInput = document.getElementById('player-name');
  playerName = nameInput.value.trim();
  
  if (playerName && playerName.length >= 2) {
    // Guardar en localStorage para persistencia
    localStorage.setItem('playerName', playerName);
    
    // Actualizar interfaz
    nameInput.disabled = true;
    document.getElementById('save-name-btn').disabled = true;
    document.getElementById('save-name-btn').textContent = '✅ Saved';
    
    showMessage(`Hello ${playerName}! Your name has been saved.`, 'success');
  } else {
    showMessage('Please enter a name with at least 2 characters', 'error');
  }
}

/**
 * Muestra un mensaje temporal
 */
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

/**
 * Guarda la puntuación en el servidor
 */
async function saveScoreToServer() {
  if (!isOnline || !playerName) return;
  
  const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
  const correctAnswers = answersLog.filter(log => log.isCorrect).length;
  
  const scoreData = {
    player_name: playerName,
    score: score,
    correct_answers: correctAnswers,
    total_questions: filteredQuestions.length,
    time_taken: Math.round(totalTime),
    streak: Math.max(...Array.from({length: answersLog.length}, (_, i) => {
      let currentStreak = 0;
      for (let j = i; j < answersLog.length; j++) {
        if (answersLog[j] && answersLog[j].isCorrect) currentStreak++;
        else break;
      }
      return currentStreak;
    })) || 0
  };
  
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData)
    });
    
    if (response.ok) {
      console.log('✅ Score saved on server');
      return true;
    }
  } catch (error) {
    console.log('❌ Error saving score:', error);
  }
  return false;
}

/**
 * Muestra el ranking global
 */
async function showLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    if (response.ok) {
      leaderboard = await response.json();
      
      const leaderboardHTML = `
        <div class="leaderboard-overlay">
          <div class="leaderboard-content">
            <h2>🏆 Global Ranking</h2>
            ${leaderboard.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${leaderboard.map((player, index) => `
                    <tr class="${player.player_name === playerName ? 'current-player' : ''}">
                      <td>${index + 1}</td>
                      <td>${player.player_name}</td>
                      <td>${player.score}</td>
                      <td>${player.correct_answers}/${player.total_questions}</td>
                      <td>${player.time_taken}s</td>
                      <td>${new Date(player.date).toLocaleDateString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `
              <p class="no-scores">No scores yet. Be the first to play!</p>
            `}
            <button id="close-leaderboard">Close</button>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', leaderboardHTML);
      document.getElementById('close-leaderboard').addEventListener('click', () => {
        document.querySelector('.leaderboard-overlay').remove();
      });
    }
  } catch (error) {
    showMessage('Error loading ranking. Check your connection.', 'error');
  }
}

/**
 * Carga el nombre del jugador desde localStorage
 */
function loadPlayerName() {
  const savedName = localStorage.getItem('playerName');
  if (savedName) {
    playerName = savedName;
    const nameInput = document.getElementById('player-name');
    nameInput.value = playerName;
    nameInput.disabled = true;
    document.getElementById('save-name-btn').disabled = true;
    document.getElementById('save-name-btn').textContent = '✅ Saved';
  }
}

// ========== CONFIGURACIÓN DE EVENT LISTENERS ==========

// Navegación entre preguntas
nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);

// Saltar pregunta
skipBtn.addEventListener("click", () => {
  answersLog[currentQuestion] = {
    question: filteredQuestions[currentQuestion].question,
    selected: null,
    correct: filteredQuestions[currentQuestion].answer,
    isCorrect: false,
    skipped: true,
    explanation: filteredQuestions[currentQuestion].explanation
  };
  streak = 0;
  updateStats();
  nextQuestion();
});

// Solicitar pista
hintBtn.addEventListener("click", showHint);

// Selectores de dificultad
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDifficulty = btn.dataset.difficulty;
    filterQuestions();
  });
});

// Selectores de categoría
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    filterQuestions();
  });
});

// ========== INICIALIZACIÓN DEL JUEGO ==========
// Inicializar características online y luego empezar el juego
initializeOnlineFeatures().then(() => {
  // Cargar nombre del jugador si existe
  loadPlayerName();
  
  // Iniciar juego
  startTimer();
  filterQuestions();
});