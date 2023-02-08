export const cubic = value => Math.pow(value, 3);
export const easeInOutCubic = value => (value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2);
