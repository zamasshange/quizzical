import { performance } from "perf_hooks";

const { generateImageQuizBatch } = await import("../lib/quizGenerator.ts");

const allFootballers = [
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Kylian Mbappé",
  "Neymar",
  "Erling Haaland",
  "Mohamed Salah",
  "Kevin De Bruyne",
  "Robert Lewandowski",
  "Harry Kane",
  "Luka Modrić",
  "Pelé",
  "Zinedine Zidane",
];

const start = performance.now();
const exhausted = await generateImageQuizBatch(
  "Football",
  10,
  "Medium",
  { answers: allFootballers.map((a) => a.toLowerCase()) },
  { fastStart: true },
);
console.log(
  `Football (all excluded): ${exhausted.length} questions in ${Math.round(performance.now() - start)}ms`,
);
