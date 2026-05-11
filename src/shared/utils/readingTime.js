export function getReadingTime(text = "") {
  const wordsPerMinute = 200;

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return {
    wordCount,
    minutes,
    label: `${minutes} min read`,
  };
}