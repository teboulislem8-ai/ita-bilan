'use client';

import { TextInput, NumberInput, DateInput, StepperInput, ChipsInput } from './InputTypes';

const TYPE_MAP = {
  text: TextInput,
  number: NumberInput,
  date: DateInput,
  stepper: StepperInput,
  chips: ChipsInput,
};

export default function CardRenderer({ card, value, onChange }) {
  const Component = TYPE_MAP[card.fieldType];
  if (!Component) return null;

  return (
    <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
      <label className="mb-2 block text-sm font-semibold text-primary-dark">
        {card.label}
      </label>
      <Component
        value={value}
        onChange={onChange}
        label={card.label}
        choices={card.choices}
      />
    </div>
  );
}
