export const UMBRALES = [
  { floor: 1, min: 0, max: 99 },
  { floor: 2, min: 100, max: 299 },
  { floor: 3, min: 300, max: 599 },
  { floor: 4, min: 600, max: 999 },
  { floor: 5, min: 1000, max: Infinity }
];

export function calcularPiso(score) {
  const rango = UMBRALES.find(u => score >= u.min && score <= u.max);
  return rango ? rango.floor : 1;
}

export function sumarScore(scoreActual, puntos) {
  return Math.max(0, Number(scoreActual || 0) + Number(puntos || 0));
}