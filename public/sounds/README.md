# Game sounds

Drop your sound effects here. The quiz players look for these exact filenames:

- `correct.mp3` — played when an answer is correct
- `wrong.mp3` — played when an answer is wrong or time runs out

They're loaded from `/sounds/correct.mp3` and `/sounds/wrong.mp3` (see `lib/sound.ts`).
Sound respects the global mute toggle in the navbar, and missing files fail
silently so the game never breaks if a file is absent.
