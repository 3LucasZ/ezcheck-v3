//animations
export const t_LEDOn = 700;
export const t_LEDOff = 1; //MUST BE NON-ZERO TO MAKE SURE THE LED TURNS OFF AT ALL. FUNNY GLITCH :D
export const t_cursorOn = 400;
export const t_cursorOff = 200;
export const t_nextLetter = 600;
//dimensions
export const boxWidth = 1.13;
export const boxHeight = 1.35;
export const boxDepth = 0.5;
export const boxPad = 0.05;

export const ledRadius = boxDepth / 2 - 0.05;
export const ledHeight = 0.2;

export const lcdWidth = boxWidth - 2 * boxPad;
export const lcdHeight = lcdWidth / 3;
export const lcdDepth = 0.02;
export const lcdPad = 0.025;

export const gridLen = boxHeight - 3 * boxPad - lcdHeight;
export const gridPad = 0.04;
export const gridDepth = 0.03;

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
export const keyUpDepth = 0.03;
export const keyDownDepth = 0.01;
