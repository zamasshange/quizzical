/** Guess the Athlete — individual / niche sports only (no football, basketball, etc.). */

/** Household names from major team sports — excluded from athlete quizzes. */
export const MAJOR_SPORT_ATHLETE_NAMES = new Set(
  [
    // Football / soccer
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Kylian Mbappé",
    "Neymar",
    "Erling Haaland",
    "Robert Lewandowski",
    "Mohamed Salah",
    "Harry Kane",
    "Luka Modrić",
    "Kevin De Bruyne",
    "Pelé",
    "Diego Maradona",
    "Zinedine Zidane",
    "Ronaldinho",
    // Basketball
    "LeBron James",
    "Michael Jordan",
    "Kobe Bryant",
    "Stephen Curry",
    "Shaquille O'Neal",
    "Magic Johnson",
    "Kevin Durant",
    "Giannis Antetokounmpo",
    // American football
    "Tom Brady",
    "Patrick Mahomes",
    "Aaron Rodgers",
    "Joe Montana",
    // Cricket
    "Virat Kohli",
    "Sachin Tendulkar",
    "MS Dhoni",
    "Ben Stokes",
    // Baseball
    "Babe Ruth",
    "Mike Trout",
    "Shohei Ohtani",
    // Ice hockey
    "Wayne Gretzky",
    "Sidney Crosby",
    "Connor McDavid",
    // Rugby (major team sport in many regions)
    "Jonah Lomu",
    "Richie McCaw",
  ].map((n) => n.toLowerCase()),
);

export function isMajorTeamSportAthlete(name: string): boolean {
  return MAJOR_SPORT_ATHLETE_NAMES.has(name.toLowerCase().trim());
}

export const ATHLETE_AI_SPORT_RULE =
  "ONLY pick athletes from individual or niche sports: tennis, athletics/track, swimming, " +
  "gymnastics, Formula 1, golf, boxing, cycling, martial arts/MMA, surfing, skiing, " +
  "snowboarding, badminton, table tennis, climbing, triathlon, fencing, archery, " +
  "wrestling, figure skating, etc. " +
  "Do NOT include football/soccer players, basketball players, American football/NFL players, " +
  "cricket stars, baseball players, ice hockey players, or rugby union/league stars.";

export const ATHLETE_KIND_LABEL =
  "famous athletes from individual and niche sports (not football, basketball, or other major team sports)";
