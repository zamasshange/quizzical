import { performance } from "perf_hooks";

const { generateImageQuizBatch } = await import("../lib/quizGenerator.ts");

for (const category of ["Football", "Music"]) {
  const start = performance.now();
  const questions = await generateImageQuizBatch(
    category,
    10,
    "Medium",
    undefined,
    { fastStart: true },
  );
  const ms = Math.round(performance.now() - start);
  console.log(`${category}: ${questions.length} questions in ${ms}ms`);
}
