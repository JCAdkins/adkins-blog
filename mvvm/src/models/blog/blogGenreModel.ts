const genreOptions = [
  "educational",
  "excursion",
  "review",
  "comparison",
  "tutorial",
  "news",
] as const;

export type BlogGenre = (typeof genreOptions)[number];
