// Cosmic color utilities
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

export const lerpColor = (a: string, b: string, t: number): string => {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round((ar + (br - ar) * t) * 255);
  const g = Math.round((ag + (bg - ag) * t) * 255);
  const blue = Math.round((ab + (bb - ab) * t) * 255);
  return `rgb(${r}, ${g}, ${blue})`;
};
