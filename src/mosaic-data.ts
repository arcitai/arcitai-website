const letters = [
  ["110", "101", "101", "101", "110"],
  ["010", "101", "111", "101", "101"],
  ["111", "010", "010", "010", "010"],
  ["010", "101", "111", "101", "101"],
];

// A 15-column word on a 32-column field: the closest whole-cell centre,
// with eight empty columns to its left and nine to its right.
export const dataBounds = { left: -6, right: 8, top: 1, bottom: 5 };
export const dataCells = letters.flatMap((letter, index) =>
  letter.flatMap((row, y) =>
    [...row].flatMap((ink, x) =>
      ink === "1"
        ? [{ column: dataBounds.left + index * 4 + x, row: y + 1, delay: index * 2 + x * 0.12 }]
        : [],
    ),
  ),
);
export const isDataCell = (column: number, row: number) =>
  dataCells.some((cell) => cell.column === column && cell.row === row);
