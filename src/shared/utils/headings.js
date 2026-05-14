export function slugifyHeading(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractMarkdownHeadings(markdown = "") {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];

  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[#*_`]/g, "").trim();

    headings.push({
      id: slugifyHeading(text),
      text,
      level,
    });
  }

  return headings;
}