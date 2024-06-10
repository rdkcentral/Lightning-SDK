export type ColorTransform = {
  alpha(value: number): ColorTransform;
  hue(value: number): ColorTransform;
  lightness(value: number): ColorTransform;
  saturation(value: number): ColorTransform;
  lighter(value: number): ColorTransform;
  darker(value: number): ColorTransform;
  mix(color: string, percentage: number): ColorTransform;
  get(): number;
};

declare const Color: (colorName: string) => ColorTransform;

export default Color;
