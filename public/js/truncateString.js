/**
 * Truncates a string by word count or line count.
 * @param {string} str - The input text.
 * @param {Object} options - { maxWords, maxLines }
 * @returns {Object} - { text, isTruncated }
 */
function truncateString(str, { maxWords, maxLines }) {
  if (!str) return { text: "", isTruncated: false };

  let text = str.trim();
  let isTruncated = false;

  // 1. Handle Line Count (splitting by newline)
  if (maxLines !== undefined) {
    const lines = text.split(/\r?\n/);
    if (lines.length > maxLines) {
      text = lines.slice(0, maxLines).join("\n");
      isTruncated = true;
    }
  }

  // 2. Handle Word Count (splitting by spaces)
  // Only runs if not already truncated by line count
  if (maxWords !== undefined && !isTruncated) {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
      text = words.slice(0, maxWords).join(" ");
      isTruncated = true;
    }
  }

  return {
    text: isTruncated ? `${text.trim()} <span style="font-weight: 800; color: var(--colordarker)">. . .</span>` : text,
    isTruncated: isTruncated
  };
}

export default truncateString;