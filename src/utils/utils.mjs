/**
 * Compare two string arrays regardless of order
 * @param {String[]} array1
 * @param {String[]} array2
 * @returns
 */
function areArraysEqualUnordered(array1, array2) {
  // Same length means they could be equal
  if (array1.length !== array2.length) {
    return false;
  }

  // Create copies to avoid modifying original arrays
  const sortedArray1 = [...array1].sort();
  const sortedArray2 = [...array2].sort();

  // Compare sorted arrays
  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }
  return true;
}

export { areArraysEqualUnordered };
