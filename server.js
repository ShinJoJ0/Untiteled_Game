/*
 * Servidor para el juego online de Comparativos y Superlativos
 * Usa Node.js con Express y SQLite
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Sirve archivos estáticos desde la raíz

// Base de datos SQLite (usa archivo físico para persistencia)
const db = new sqlite3.Database('game.db');

// Inicializar base de datos
db.serialize(() => {
  // Tabla de puntuaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_taken INTEGER NOT NULL,
      streak INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);
  
  // Tabla de preguntas
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      option1 TEXT NOT NULL,
      option2 TEXT NOT NULL,
      option3 TEXT NOT NULL,
      answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);
  
  // Verificar si ya hay preguntas insertadas
  db.get("SELECT COUNT(*) as count FROM questions", (err, row) => {
    if (err) {
      console.error('Error checking questions:', err);
      return;
    }
    
    if (row.count === 0) {
      console.log('Insertando preguntas en la base de datos...');
      insertSampleQuestions();
    }
  });
});

// Función para insertar preguntas de ejemplo
function insertSampleQuestions() {
  const questions = [
    {
      question: "Which is the correct comparative form?",
      option1: "Bigger",
      option2: "More big", 
      option3: "Biggest",
      answer: "Bigger",
      explanation: "'Bigger' es la forma comparativa correcta de 'big'. Para adjetivos de una sílaba, añadimos -er.",
      difficulty: "easy",
      category: "comparative"
    },
    {
      question: "Choose the superlative form:",
      option1: "Fast",
      option2: "Faster",
      option3: "Fastest",
      answer: "Fastest",
      explanation: "'Fastest' es la forma superlativa correcta de 'fast'. Para adjetivos de una sílaba, añadimos -est.",
      difficulty: "easy",
      category: "superlative"
    },
    // Puedes añadir más preguntas aquí...
  ];

  const stmt = db.prepare(`
    INSERT INTO questions (question, option1, option2, option3, answer, explanation, difficulty, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  questions.forEach(q => {
    stmt.run(
      q.question, q.option1, q.option2, q.option3, 
      q.answer, q.explanation, q.difficulty, q.category
    );
  });

  stmt.finalize();
  console.log('Preguntas insertadas correctamente');
}

// Rutas de la API

// Obtener todas las preguntas
app.get('/api/questions', (req, res) => {
  db.all("SELECT * FROM questions", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Guardar puntuación
app.post('/api/scores', (req, res) => {
  const { player_name, score, correct_answers, total_questions, time_taken, streak } = req.body;
  
  if (!player_name || player_name.trim() === '') {
    return res.status(400).json({ error: 'El nombre del jugador es requerido' });
  }

  const stmt = db.prepare(`
    INSERT INTO scores (player_name, score, correct_answers, total_questions, time_taken, streak, date)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  
  stmt.run(
    player_name.trim(), 
    score, 
    correct_answers, 
    total_questions, 
    time_taken, 
    streak, 
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Puntuación guardada exitosamente' });
    }
  );
  
  stmt.finalize();
});

// Obtener ranking de puntuaciones
app.get('/api/leaderboard', (req, res) => {
  db.all(`
    SELECT player_name, score, correct_answers, total_questions, time_taken, streak, date 
    FROM scores 
    ORDER BY score DESC, time_taken ASC 
    LIMIT 20
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎮 Servidor del juego corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api/`);
});