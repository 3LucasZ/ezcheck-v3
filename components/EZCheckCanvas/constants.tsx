export const boxWidth = 1.13;
export const boxHeight = 1.35;
export const boxDepth = 0.5;
export const boxPad = 0.05;

export const ledRadius = boxDepth / 2 - 0.05;
export const ledHeight = 0.2;

export const lcdWidth = boxWidth - 2 * boxPad;
export const lcdHeight = lcdWidth / 3;
export const lcdDepth = 0.01;
export const lcdPad = 0.025;

export const gridLen = boxHeight - 3 * boxPad - lcdHeight;
export const gridPad = 0.04;
export const gridDepth = 0.04;

export const keys = [
  "1",
  "2",
  "3",
  "A",
  "4",
  "5",
  "6",
  "B",
  "7",
  "8",
  "9",
  "C",
  "*",
  "0",
  "#",
  "D",
];
export const keyLen = (gridLen - 5 * gridPad) / 4;
export const keyDepth = 0.08;
