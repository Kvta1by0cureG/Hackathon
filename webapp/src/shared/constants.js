export const UMBRALES_PISO = [
  { floor: 1, min: 0, max: 99, label: 'Bronce' },
  { floor: 2, min: 100, max: 299, label: 'Plata' },
  { floor: 3, min: 300, max: 599, label: 'Oro' },
  { floor: 4, min: 600, max: 999, label: 'Platino' },
  { floor: 5, min: 1000, max: Infinity, label: 'Diamante' }
];

export function calcularPiso(score) {
  const rango = UMBRALES_PISO.find(u => score >= u.min && score <= u.max);
  return rango ? rango.floor : 1;
}

export function progresoPiso(score) {
  const floor = calcularPiso(score);
  const rango = UMBRALES_PISO.find(u => u.floor === floor);
  if (!rango || rango.max === Infinity) {
    return { floor, label: rango?.label, porcentaje: 100, faltan: 0, siguiente: null };
  }
  const total = rango.max - rango.min + 1;
  const avance = score - rango.min;
  const porcentaje = Math.min(100, Math.round((avance / total) * 100));
  const siguiente = UMBRALES_PISO.find(u => u.floor === floor + 1);
  return {
    floor,
    label: rango.label,
    porcentaje,
    faltan: rango.max + 1 - score,
    siguiente: siguiente ? siguiente.label : null
  };
}