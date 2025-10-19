/*
 * Base de datos de preguntas para el juego de Comparativos y Superlativos
 * Cada pregunta tiene:
 * - question: Texto de la pregunta
 * - options: Array con las opciones de respuesta
 * - answer: Respuesta correcta
 * - explanation: Explicación gramatical
 * - difficulty: Nivel de dificultad (easy, medium, hard)
 * - category: Categoría (comparative, superlative)
 */

const questions = [
  { 
    question: "Which is the correct comparative form?", 
    options: ["Bigger", "More big", "Biggest"], 
    answer: "Bigger", 
    explanation: "'Bigger' es la forma comparativa correcta de 'big'. Para adjetivos de una sílaba, añadimos -er.",
    difficulty: "easy",
    category: "comparative"
  },
  { 
  question: "Which option correctly completes the sentence? 'Mount Everest is ___ mountain in the world.'", 
  options: ["the taller", "the most tall", "the tallest"], 
  answer: "the tallest", 
  explanation: "Usamos 'the tallest' para expresar el grado máximo (superlativo) de 'tall'.",
  difficulty: "easy",
  category: "superlative"
  },
  { 
  question: "Select the correct option: 'This solution is ___ practical than it initially appeared, though not the ___ one available.'", 
  options: [
    "more / most", 
    "most / more", 
    "more / best"
  ], 
  answer: "more / most", 
  explanation: "El primer espacio requiere un comparativo ('more practical than...'), y el segundo un superlativo ('the most one available'), manteniendo consistencia en la estructura comparativa y superlativa.",
  difficulty: "hard",
  category: "comparative-superlative"
  },
  { 
  question: "Which sentence is correct?", 
  options: [
    "My car is more fast than yours.", 
    "My car is faster than yours.", 
    "My car is fastest than yours."
  ], 
  answer: "My car is faster than yours.", 
  explanation: "‘Fast’ es un adjetivo corto, así que el comparativo correcto es ‘faster’.",
  difficulty: "medium",
  category: "comparative"
  },
  { 
  question: "Which sentence is correct?", 
  options: [
    "My car is more fast than yours.", 
    "My car is faster than yours.", 
    "My car is fastest than yours."
  ], 
  answer: "My car is faster than yours.", 
  explanation: "‘Fast’ es un adjetivo corto, así que el comparativo correcto es ‘faster’.",
  difficulty: "medium",
  category: "comparative"
  },
  { 
    question: "Choose the superlative form:", 
    options: ["Fast", "Faster", "Fastest"], 
    answer: "Fastest", 
    explanation: "'Fastest' es la forma superlativa correcta de 'fast'. Para adjetivos de una sílaba, añadimos -est.",
    difficulty: "easy",
    category: "superlative"
  },
  { 
    question: "Comparative of 'happy':", 
    options: ["Happier", "More happy", "Happiest"], 
    answer: "Happier", 
    explanation: "'Happier' es la forma comparativa correcta. Para adjetivos de dos sílabas que terminan en -y, cambiamos la -y por -ier.",
    difficulty: "easy",
    category: "comparative"
  },
  { 
    question: "Superlative of 'good':", 
    options: ["Better", "Goodest", "Best"], 
    answer: "Best", 
    explanation: "'Best' es la forma superlativa correcta de 'good'. 'Good' es un adjetivo irregular.",
    difficulty: "medium",
    category: "superlative"
  },
  { 
    question: "Comparative of 'cold':", 
    options: ["Colder", "More cold", "Coldest"], 
    answer: "Colder", 
    explanation: "'Colder' es la forma comparativa correcta de 'cold'. Para adjetivos de una sílaba, añadimos -er.",
    difficulty: "easy",
    category: "comparative"
  },
  { 
  question: "Fill in the blanks: 'The conference room on the top floor is ___ accessible, but the one downstairs is by far the ___ convenient for everyone.'", 
  options: [
    "less / most", 
    "least / more", 
    "less / more"
  ], 
  answer: "less / most", 
  explanation: "‘Less accessible’ expresa un grado comparativo negativo, mientras que ‘the most convenient’ es el superlativo correcto al comparar entre varios espacios.",
  difficulty: "hard",
  category: "comparative-superlative"
  },
  { 
    question: "Superlative of 'bad':", 
    options: ["Worse", "Worst", "Baddest"], 
    answer: "Worst", 
    explanation: "'Worst' es la forma superlativa correcta de 'bad'. 'Bad' es un adjetivo irregular.",
    difficulty: "medium",
    category: "superlative"
  },
  { 
    question: "Which is the correct comparative of 'interesting'?", 
    options: ["More interesting", "Interestinger", "Most interesting"], 
    answer: "More interesting", 
    explanation: "'More interesting' es la forma comparativa correcta. Para adjetivos de tres o más sílabas, usamos 'more' antes del adjetivo.",
    difficulty: "medium",
    category: "comparative"
  },
  { 
    question: "Superlative of 'beautiful':", 
    options: ["Most beautiful", "Beautifullest", "More beautiful"], 
    answer: "Most beautiful", 
    explanation: "'Most beautiful' es la forma superlativa correcta. Para adjetivos de tres o más sílabas, usamos 'most' antes del adjetivo.",
    difficulty: "medium",
    category: "superlative"
  },
  { 
    question: "Comparative of 'far':", 
    options: ["Farrer", "Further", "Farest"], 
    answer: "Further", 
    explanation: "'Further' es la forma comparativa correcta de 'far'. 'Far' es un adjetivo irregular.",
    difficulty: "hard",
    category: "comparative"
  },
  { 
    question: "Superlative of 'little' (cantidad):", 
    options: ["Least", "Less", "Littlest"], 
    answer: "Least", 
    explanation: "'Least' es la forma superlativa correcta de 'little' cuando hablamos de cantidad. 'Little' es un adjetivo irregular.",
    difficulty: "hard",
    category: "superlative"
  },
  { 
    question: "Comparative of 'expensive':", 
    options: ["Expensiver", "More expensive", "Most expensive"], 
    answer: "More expensive", 
    explanation: "'More expensive' es la forma comparativa correcta. Para adjetivos de tres o más sílabas, usamos 'more' antes del adjetivo.",
    difficulty: "medium",
    category: "comparative"
  },
  { 
    question: "Superlative of 'smart':", 
    options: ["Smarter", "Smartest", "More smart"], 
    answer: "Smartest", 
    explanation: "'Smartest' es la forma superlativa correcta de 'smart'. Para adjetivos de una sílaba, añadimos -est.",
    difficulty: "easy",
    category: "superlative"
  },
  { 
    question: "Comparative of 'funny':", 
    options: ["Funnier", "More funny", "Funniest"], 
    answer: "Funnier", 
    explanation: "'Funnier' es la forma comparativa correcta. Para adjetivos de dos sílabas que terminan en -y, cambiamos la -y por -ier.",
    difficulty: "easy",
    category: "comparative"
  },
  { 
    question: "Superlative of 'important':", 
    options: ["Importanter", "More important", "Most important"], 
    answer: "Most important", 
    explanation: "'Most important' es la forma superlativa correcta. Para adjetivos de tres o más sílabas, usamos 'most' antes del adjetivo.",
    difficulty: "medium",
    category: "superlative"
  },
   { 
    question: "Superlative of 'heavy':", 
    options: ["Heavier", "Heaviest", "Most heavy"], 
    answer: "Heaviest", 
    explanation: "'Heaviest' es la forma superlativa correcta. Para adjetivos que terminan en consonante + y, cambiamos la y por i y añadimos -est.",
    difficulty: "easy",
    category: "superlative"
  }
];