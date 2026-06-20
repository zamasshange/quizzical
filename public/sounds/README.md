# Game sounds

Drop your sound effect files here. The app loads them from `/sounds/<filename>` (see `lib/sound.ts`).

## Required files

| File | When it plays |
|------|----------------|
| `click.mp3` | Button taps across the site (Button3D, answer picks, continue, etc.) |
| `correct.mp3` | Correct answer during a quiz |
| `wrong.mp3` | Wrong answer or time runs out |
| `quiz-complete.mp3` | Generic quiz finished (mixed score) |
| `celebration.mp3` | Perfect score / 100% correct |
| `fair-play.mp3` | Quiz finished with mostly wrong answers (≤40% correct) |

## Notes

- Volume levels are tuned in code: click is quieter (0.3), celebration is louder (0.7).
- Sound respects the global mute toggle in the navbar (`localStorage` key `quizzical-muted`).
- Missing files fail silently — subtle Web Audio beeps are used as fallback until real mp3s are added.
