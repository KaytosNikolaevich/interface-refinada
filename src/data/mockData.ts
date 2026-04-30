export interface Module {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  lessonsCount: number;
  completedLessons: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: "letra" | "silaba" | "palavra" | "frase";
  imageUrl: string;
  textContent: string;
  orderIndex: number;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: "multiple_choice" | "audio_select";
  questionText: string;
  options: ExerciseOption[];
}

export interface ExerciseOption {
  id: string;
  content: string;
  imageUrl: string;
  isCorrect: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}

const emojiImg = (emoji: string) => `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>${emoji}</text></svg>`;

export const modules: Module[] = [
  { id: "1", title: "Letras", icon: "🔤", description: "Aprenda as letras do alfabeto", color: "bg-primary", lessonsCount: 26, completedLessons: 0 },
  { id: "2", title: "Sílabas", icon: "📝", description: "Junte as letras em sílabas", color: "bg-secondary", lessonsCount: 15, completedLessons: 0 },
  { id: "3", title: "Palavras", icon: "📖", description: "Forme suas primeiras palavras", color: "bg-accent", lessonsCount: 10, completedLessons: 0 },
  { id: "4", title: "Frases", icon: "💬", description: "Construa frases simples", color: "bg-warning", lessonsCount: 4, completedLessons: 0 },
];

const letterEmojis: Record<string, string> = {
  A: "✈️", B: "🍌", C: "🏠", D: "🦕", E: "⭐", F: "🌸", G: "🐱", H: "🚁",
  I: "🏝️", J: "🐊", K: "🥝", L: "🦁", M: "🐒", N: "☁️", O: "👁️", P: "🐧",
  Q: "🧀", R: "🐀", S: "☀️", T: "🐢", U: "🍇", V: "🎻", W: "🧇", X: "☕",
  Y: "🧘", Z: "🦓"
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const lessons: Lesson[] = [
  ...alphabet.map((letter, i) => ({
    id: `l-${letter}`,
    moduleId: "1",
    title: `Letra ${letter}`,
    contentType: "letra" as const,
    imageUrl: emojiImg(letterEmojis[letter]),
    textContent: letter,
    orderIndex: i + 1,
  })),
  ...[
    { syl: "BA", e: "🍌" }, // Banana
    { syl: "BE", e: "👶" }, // Bebê
    { syl: "BI", e: "🚲" }, // Bicicleta
    { syl: "BO", e: "⚽" }, // Bola
    { syl: "BU", e: "🫏" }, // Burro
    { syl: "CA", e: "🏠" }, // Casa
    { syl: "CE", e: "🥕" }, // Cenoura
    { syl: "CI", e: "🎪" }, // Circo
    { syl: "CO", e: "🥥" }, // Coco
    { syl: "CU", e: "🧊" },
    { syl: "DA", e: "🎲" }, // Dado
    { syl: "DE", e: "🦷" }, // Dente
    { syl: "DI", e: "🦕" }, // Dinossauro
    { syl: "DO", e: "🍬" }, // Doce
    { syl: "DU", e: "👥" },
  ].map((item, i) => ({
    id: `l-syl-${item.syl}`,
    moduleId: "2",
    title: `Sílaba ${item.syl}`,
    contentType: "silaba" as const,
    imageUrl: emojiImg(item.e),
    textContent: item.syl,
    orderIndex: i + 1,
  })),
  ...([
    { w: "BOLA", e: "⚽" }, { w: "CASA", e: "🏠" }, { w: "DADO", e: "🎲" },
    { w: "FACA", e: "🔪" }, { w: "GATO", e: "🐱" }, { w: "LAGO", e: "🏞️" },
    { w: "MALA", e: "🧳" }, { w: "NADO", e: "🏊" }, { w: "PATO", e: "🦆" },
    { w: "RATO", e: "🐀" },
  ] as const).map((item, i) => ({
    id: `l-word-${item.w}`,
    moduleId: "3",
    title: item.w,
    contentType: "palavra" as const,
    imageUrl: emojiImg(item.e),
    textContent: item.w,
    orderIndex: i + 1,
  })),
];

const opt = (id: string, content: string, emoji: string, isCorrect: boolean): ExerciseOption => ({
  id, content, imageUrl: emojiImg(emoji), isCorrect,
});

export const exercises: Exercise[] = [
  { id: "e-A1", lessonId: "l-A", type: "multiple_choice", questionText: "Qual é a letra A?", options: [opt("o1","A","✈️",true), opt("o2","B","🍌",false), opt("o3","C","🏠",false)] },
  { id: "e-A2", lessonId: "l-A", type: "multiple_choice", questionText: "Toque na letra A", options: [opt("o4","D","🦕",false), opt("o5","A","✈️",true), opt("o6","E","⭐",false)] },
  { id: "e-A3", lessonId: "l-A", type: "multiple_choice", questionText: "Encontre o A", options: [opt("o7","F","🌸",false), opt("o8","G","🐱",false), opt("o9","A","✈️",true)] },
  { id: "e-B1", lessonId: "l-B", type: "multiple_choice", questionText: "Qual é a letra B?", options: [opt("o10","B","🍌",true), opt("o11","D","🦕",false), opt("o12","P","🐧",false)] },
  { id: "e-B2", lessonId: "l-B", type: "multiple_choice", questionText: "Toque na letra B", options: [opt("o13","R","🐀",false), opt("o14","B","🍌",true), opt("o15","Q","🧀",false)] },
  { id: "e-B3", lessonId: "l-B", type: "multiple_choice", questionText: "Encontre o B", options: [opt("o16","A","✈️",false), opt("o17","C","🏠",false), opt("o18","B","🍌",true)] },
  { id: "e-C1", lessonId: "l-C", type: "multiple_choice", questionText: "Qual é a letra C?", options: [opt("o19","C","🏠",true), opt("o20","G","🐱",false), opt("o21","O","👁️",false)] },
  { id: "e-D1", lessonId: "l-D", type: "multiple_choice", questionText: "Qual é a letra D?", options: [opt("o22","B","🍌",false), opt("o23","D","🦕",true), opt("o24","P","🐧",false)] },
  { id: "e-E1", lessonId: "l-E", type: "multiple_choice", questionText: "Qual é a letra E?", options: [opt("o25","E","⭐",true), opt("o26","F","🌸",false), opt("o27","I","🏝️",false)] },
  { id: "e-BA1", lessonId: "l-syl-BA", type: "multiple_choice", questionText: "Qual é a sílaba BA?", options: [opt("os1","BA","🍌",true), opt("os2","DA","🦕",false), opt("os3","CA","🏠",false)] },
  { id: "e-BA2", lessonId: "l-syl-BA", type: "multiple_choice", questionText: "Toque em BA", options: [opt("os4","BO","⚽",false), opt("os5","BA","🍌",true), opt("os6","BE","👶",false)] },
  { id: "e-CA1", lessonId: "l-syl-CA", type: "multiple_choice", questionText: "Qual é a sílaba CA?", options: [opt("os7","CA","🏠",true), opt("os8","CO","🥥",false), opt("os9","DA","🦕",false)] },
  { id: "e-CA2", lessonId: "l-syl-CA", type: "multiple_choice", questionText: "Toque em CA", options: [opt("os10","BA","🍌",false), opt("os11","CA","🏠",true), opt("os12","CU","🧊",false)] },
  { id: "e-DA1", lessonId: "l-syl-DA", type: "multiple_choice", questionText: "Qual é a sílaba DA?", options: [opt("os13","DA","🎲",true), opt("os14","BA","🍌",false), opt("os15","DE","🦷",false)] },
  { id: "e-DA2", lessonId: "l-syl-DA", type: "multiple_choice", questionText: "Toque em DA", options: [opt("os16","DI","💎",false), opt("os17","DA","🎲",true), opt("os18","DO","🎵",false)] },
  { id: "e-BOLA", lessonId: "l-word-BOLA", type: "multiple_choice", questionText: "Onde está a BOLA?", options: [opt("ow1","BOLA","⚽",true), opt("ow2","CASA","🏠",false), opt("ow3","GATO","🐱",false)] },
  { id: "e-CASA", lessonId: "l-word-CASA", type: "multiple_choice", questionText: "Onde está a CASA?", options: [opt("ow4","DADO","🎲",false), opt("ow5","CASA","🏠",true), opt("ow6","MALA","🧳",false)] },
  { id: "e-GATO", lessonId: "l-word-GATO", type: "multiple_choice", questionText: "Onde está o GATO?", options: [opt("ow7","PATO","🦆",false), opt("ow8","RATO","🐀",false), opt("ow9","GATO","🐱",true)] },
  { id: "e-PATO", lessonId: "l-word-PATO", type: "multiple_choice", questionText: "Onde está o PATO?", options: [opt("ow10","PATO","🦆",true), opt("ow11","GATO","🐱",false), opt("ow12","RATO","🐀",false)] },
  { id: "e-DADO", lessonId: "l-word-DADO", type: "multiple_choice", questionText: "Onde está o DADO?", options: [opt("ow13","BOLA","⚽",false), opt("ow14","DADO","🎲",true), opt("ow15","LAGO","🏞️",false)] },
];

export const avatars = [
  "🧑", "👧", "👦", "👩", "👨", "🧒",
  "🦸", "🦹", "🧙", "🧚", "🧜", "🤴",
  "👸", "🧑‍🚀", "🧑‍🎤", "🥷",
  "🦊", "🐱", "🐶", "🐼", "🦁", "🐯",
  "🐵", "🦄", "🐸", "🐰",
];

export const achievements: Achievement[] = [
  { id: "a1", title: "Primeira Aula", icon: "⭐", unlocked: false },
  { id: "a2", title: "5 Acertos", icon: "🎯", unlocked: false },
  { id: "a3", title: "Módulo Completo", icon: "🏆", unlocked: false },
  { id: "a4", title: "Sem Erros", icon: "💎", unlocked: false },
  { id: "a5", title: "7 Dias Seguidos", icon: "🔥", unlocked: false },
  { id: "a6", title: "Todas as Letras", icon: "🎓", unlocked: false },
];
