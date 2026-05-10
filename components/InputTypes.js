'use client';

export function TextInput({ value, onChange, label }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="min-h-[44px] w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      placeholder={label}
      dir="auto"
    />
  );
}

export function NumberInput({ value, onChange, label }) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={e => onChange(e.target.value ? Number(e.target.value) : '')}
      className="min-h-[44px] w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      placeholder={label}
    />
  );
}

export function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="min-h-[44px] w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

export function StepperInput({ value, onChange }) {
  const val = value ?? 0;
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, val - 1))}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary text-white text-xl font-bold active:scale-95"
      >
        −
      </button>
      <span className="min-w-[3rem] text-center text-xl font-semibold">{val}</span>
      <button
        type="button"
        onClick={() => onChange(val + 1)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary text-white text-xl font-bold active:scale-95"
      >
        +
      </button>
    </div>
  );
}

export function ChipsInput({ value, onChange, choices }) {
  const selected = Array.isArray(value) ? value : [];
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map(choice => (
        <button
          key={choice}
          type="button"
          onClick={() => {
            const next = selected.includes(choice)
              ? selected.filter(c => c !== choice)
              : [...selected, choice];
            onChange(next);
          }}
          className={`min-h-[44px] min-w-[44px] rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95 ${
            selected.includes(choice)
              ? 'bg-primary text-white'
              : 'bg-surface-alt text-primary border border-primary/20'
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
