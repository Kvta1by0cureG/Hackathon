import { UMBRALES_PISO } from '../shared/constants.js';

export default function FloorSelector({ actual, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {UMBRALES_PISO.map((u) => {
        const activo = u.floor === actual;
        return (
          <button
            key={u.floor}
            onClick={() => onSelect(u.floor)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition
              ${activo
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-brand-500'}`}
          >
            {u.label}
          </button>
        );
      })}
    </div>
  );
}