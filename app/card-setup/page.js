'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, useCardConfigStore, useLangStore } from '@/lib/stores';
import { PREDEFINED_CARDS, DEFAULT_ACTIVE_CARDS } from '@/lib/predefinedCards';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { t } from '@/src/i18n/strings';

function SortableCard({ id, label, isActive, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex min-h-[44px] items-center gap-3 rounded-xl border border-primary/10 bg-white p-3 shadow-sm">
      <button {...attributes} {...listeners} className="flex min-h-[44px] min-w-[44px] cursor-grab items-center justify-center text-primary/40 text-lg" type="button">
        ⠿
      </button>
      <span className={`flex-1 text-sm font-medium ${isActive ? 'text-primary-dark' : 'text-primary/30 line-through'}`} dir="auto">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`min-h-[44px] min-w-[44px] rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          isActive ? 'bg-primary text-white' : 'bg-surface-alt text-primary/50'
        }`}
      >
        {isActive ? t('on', 'en') : t('off', 'en')}
      </button>
    </div>
  );
}

export default function CardSetupPage() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { cardConfig, setCardConfig } = useCardConfigStore();
  const { lang, loadLang } = useLangStore();
  const [activeCards, setActiveCards] = useState(DEFAULT_ACTIVE_CARDS);
  const [customLabel, setCustomLabel] = useState('');
  const [customType, setCustomType] = useState('text');
  const [customChoices, setCustomChoices] = useState('');
  const [hasCustom, setHasCustom] = useState(false);

  useEffect(() => { loadLang(); }, [loadLang]);
  useEffect(() => {
    if (!profile) router.push('/profile');
  }, [profile, router]);

  useEffect(() => {
    if (cardConfig) {
      setActiveCards(cardConfig.activeCards || DEFAULT_ACTIVE_CARDS);
      if (cardConfig.customCard) {
        setHasCustom(true);
        setCustomLabel(cardConfig.customCard.label);
        setCustomType(cardConfig.customCard.fieldType);
        setCustomChoices((cardConfig.customCard.choices || []).join(', '));
      }
    }
  }, [cardConfig]);

  const handleToggle = (cardId) => {
    setActiveCards(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = activeCards.indexOf(active.id);
    const newIdx = activeCards.indexOf(over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const next = [...activeCards];
    next.splice(oldIdx, 1);
    next.splice(newIdx, 0, active.id);
    setActiveCards(next);
  };

  const handleSave = async () => {
    const config = {
      activeCards,
      customCard: hasCustom && customLabel.trim()
        ? {
            label: customLabel.trim(),
            fieldType: customType,
            choices: customType === 'chips' ? customChoices.split(',').map(s => s.trim()).filter(Boolean) : undefined,
          }
        : null,
    };
    await setCardConfig(config);
    router.push('/');
  };

  const activeSet = new Set(activeCards);
  const sortedCards = PREDEFINED_CARDS.filter(c => activeSet.has(c.id));
  const inactiveCards = PREDEFINED_CARDS.filter(c => !activeSet.has(c.id));

  const typeOptions = [
    { value: 'text', label: t('typeText', lang) },
    { value: 'number', label: t('typeNumber', lang) },
    { value: 'date', label: t('typeDate', lang) },
    { value: 'stepper', label: t('typeStepper', lang) },
    { value: 'chips', label: t('typeChips', lang) },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-primary" dir="auto">{t('cardSetup', lang)}</h1>
      <p className="mb-6 text-sm text-primary/60" dir="auto">{t('cardSetupDesc', lang)}</p>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-primary-dark" dir="auto">{t('activeCards', lang)}</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {sortedCards.map(card => (
                <SortableCard key={card.id} id={card.id} label={card.label} isActive={true} onToggle={handleToggle} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {inactiveCards.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-primary-dark" dir="auto">{t('inactiveCards', lang)}</h2>
          <div className="flex flex-col gap-2">
            {inactiveCards.map(card => (
              <SortableCard key={card.id} id={card.id} label={card.label} isActive={false} onToggle={handleToggle} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-primary/10 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary-dark" dir="auto">{t('customCard', lang)}</h2>
          <button
            type="button"
            onClick={() => setHasCustom(!hasCustom)}
            className={`min-h-[44px] min-w-[44px] rounded-full px-3 py-1 text-xs font-semibold ${
              hasCustom ? 'bg-primary text-white' : 'bg-surface-alt text-primary/50'
            }`}
          >
            {hasCustom ? t('enabled', lang) : t('disabled', lang)}
          </button>
        </div>

        {hasCustom && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder={t('customFieldLabel', lang)}
              dir="auto"
            />
            <select
              value={customType}
              onChange={e => setCustomType(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {customType === 'chips' && (
              <input
                type="text"
                value={customChoices}
                onChange={e => setCustomChoices(e.target.value)}
                className="min-h-[44px] w-full rounded-lg border border-primary/20 bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder={t('choicesPlaceholder', lang)}
                dir="auto"
              />
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="min-h-[44px] w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
      >
        {t('saveLayout', lang)}
      </button>
    </div>
  );
}
