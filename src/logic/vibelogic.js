/**
 * Revisa si la letra existe en la palabra.
 * @param {string} word - La palabra a adivinar.
 * @param {string} letter - La letra a revisar.
 * @returns {false | { found: boolean, positions: number[] }}
 */
export function checkLetter(word, letter) {
  const positions = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) positions.push(i);
  }
  if (positions.length > 0) {
    return { found: true, positions };
  }
  return false;
}

/**
 * Verifica si la palabra está completa
 * @param {string[]} masked
 * @returns {boolean}
 */
export function isWordComplete(masked) {
  return !masked.includes('_');
}