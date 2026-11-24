import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { AppLanguage } from '../types/quran';

interface LanguageSetupScreenProps {
  initialLanguage: AppLanguage;
  onConfirmLanguage: (language: AppLanguage) => void;
}

interface LanguageCardOption {
  id: AppLanguage;
  nativeTitle: string;
  subtitle: string;
  ctaLabel: string;
  isRtl?: boolean;
}

const LANGUAGE_OPTIONS: LanguageCardOption[] = [
  {
    id: 'fr',
    nativeTitle: 'Français',
    subtitle: 'Interface en français · Texte arabe & traduction Hamidullah',
    ctaLabel: 'Commencer la lecture',
  },
  {
    id: 'ff',
    nativeTitle: 'Fulfulde (Pulaar)',
    subtitle: 'Kuuɓal e Fulfulde · Binndol e alkule ɓ, ɗ, ƴ, ŋ',
    ctaLabel: 'Fuɗɗo janngugol',
  },
  {
    id: 'ar',
    nativeTitle: 'العربية',
    subtitle: 'واجهة باللغة العربية · القرآن الكريم بالرسم العثماني',
    ctaLabel: 'ابدأ القراءة',
    isRtl: true,
  },
];

export function LanguageSetupScreen({
  initialLanguage,
  onConfirmLanguage,
}: LanguageSetupScreenProps) {
  const [selected, setSelected] = useState<AppLanguage>(initialLanguage);
  const activeOption =
    LANGUAGE_OPTIONS.find((opt) => opt.id === selected) ?? LANGUAGE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121614] text-[#1C1E21] dark:text-[#ECE9E2] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-6 sm:p-8">
        <div className="text-center pb-6 border-b border-[#E6E1D8] dark:border-[#2C3530]">
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic-verse text-2xl sm:text-3xl text-[#0F5C4D] dark:text-[#5EC4A6]"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="font-editorial text-2xl font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mt-4">
            Choisissez votre langue
          </h1>
          <p className="font-french-prose text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-1.5">
            Suɓo ɗemngal maa · اختر لغتك المفضلة
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Choix de la langue de l'application"
          className="mt-6 space-y-3"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(option.id)}
                className={`w-full min-h-[72px] p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F5C4D]/[0.06] dark:bg-[#5EC4A6]/10 border-[#0F5C4D] dark:border-[#5EC4A6]'
                    : 'bg-[#FAF8F5] dark:bg-[#121614] border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D]/45 dark:hover:border-[#5EC4A6]/55'
                }`}
              >
                <div className="min-w-0 flex-1" dir={option.isRtl ? 'rtl' : 'ltr'}>
                  <p className="font-french-prose text-base font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
                    {option.nativeTitle}
                  </p>
                  <p className="font-french-prose text-xs text-[#5A5F66] dark:text-[#A4ADA8] mt-0.5">
                    {option.subtitle}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#0F5C4D] text-white'
                      : 'border border-[#BFC9C4] dark:border-[#3A443F]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onConfirmLanguage(selected)}
          className="mt-6 w-full min-h-[48px] px-5 py-3 bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] text-white text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span className="font-french-prose">{activeOption.ctaLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
