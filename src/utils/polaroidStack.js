import { CAPTIONS } from "@/constants/polaroidCaptions";

export function captionFor(id) {
  return CAPTIONS[(id - 1) % CAPTIONS.length];
}

export function rotationFor(id, stackPos) {
  const sign = id % 2 === 0 ? -1 : 1;
  if (stackPos === 0) return sign * 2;
  return sign * (5 + stackPos * 2);
}

export function offsetFor(id, stackPos) {
  if (stackPos === 0) return { x: 0, y: 0 };
  const sign = id % 2 === 0 ? -1 : 1;
  return {
    x: sign * (14 + stackPos * 4),
    y: stackPos * 18,
  };
}
