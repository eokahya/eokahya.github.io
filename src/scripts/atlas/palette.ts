/** Colours of the palette slots in types.ts, matched to the plate colours in tokens.css. */
export type Rgb = readonly [number, number, number];

const hex = (value: string): Rgb => {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const darkPalette: readonly Rgb[] = ['#8fb0ff', '#4b5577', '#f2c46d', '#66e5d6', '#ff8075', '#a894ff', '#94e680', '#d6cdee', '#ff8a4d', '#4a78ff'].map(hex);
export const lightPalette: readonly Rgb[] = ['#22386f', '#8a8fa6', '#9a6100', '#00796f', '#c13b30', '#5a45cc', '#3a7f2a', '#6b6680', '#c4501a', '#1b4fc4'].map(hex);
