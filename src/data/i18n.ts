import { AppLanguage } from '../types/quran';

export interface Translations {
  appName: string;
  navSurahs: string;
  navSurahsShort: string;
  navReader: string;
  navReaderShort: string;
  navBookmarks: string;
  navResume: string;
  subtitleIndex: string;
  titleSurahs: string;
  lastReading: string;
  verseOf: (ayah: number, total: number) => string;
  surahProgress: string;
  continueReading: string;
  quickAccess: string;
  quickAccessSubtitle: string;
  searchPlaceholder: string;
  allJuz: string;
  filterAll: string;
  filterMeccan: string;
  filterMedinan: string;
  surahsDisplayed: (count: number) => string;
  noSurahFound: string;
  noSurahHint: string;
  resetFilters: string;
  modeNight: string;
  modeDay: string;
  backToSurahs: string;
  surahCountLabel: (num: number) => string;
  listenSurah: string;
  pauseAudio: string;
  jumpToVerse: string;
  verseLabel: (num: number) => string;
  versesCountLabel: (count: number) => string;
  surahPrefix: (num: number) => string;
  currentPosition: string;
  personalNote: string;
  edit: string;
  saveNote: string;
  save: string;
  cancel: string;
  notePlaceholder: string;
  noteTitleForVerse: (s: number, a: number) => string;
  changeSurah: string;
  readingSettings: string;
  appLanguageLabel: string;
  nightModeTitle: string;
  nightModeSubtitle: string;
  frenchTranslationTitle: string;
  frenchTranslationSubtitle: string;
  arabicSizeTitle: string;
  sizeCompact: string;
  sizeComfortable: string;
  sizeLarge: string;
  arabicFontTitle: string;
  latinFontTitle: string;
  fontPreviewTitle: string;
  reciterTitle: string;
  savedPositionLabel: string;
  retry: string;
  bookmarksTitle: string;
  bookmarksSubtitle: (total: number, withNotes: number) => string;
  savedReadingPosition: string;
  resumeAtVerse: string;
  searchBookmarksPlaceholder: string;
  allBookmarks: (count: number) => string;
  withNotesFilter: (count: number) => string;
  noBookmarksTitle: string;
  noBookmarksHint: string;
  browseSurahs: string;
  noFilteredBookmarks: string;
  showAll: string;
  readAction: string;
  savedOn: (date: string) => string;
  revelationLabel: (rev: 'Mecquoise' | 'Médinoise') => string;
}

const FR_TRANSLATIONS: Translations = {
  appName: 'Le Noble Coran',
  navSurahs: 'Liste des Sourates',
  navSurahsShort: 'Sourates',
  navReader: 'Lecture de la Sourate',
  navReaderShort: 'Lecture',
  navBookmarks: 'Signets',
  navResume: 'Reprendre',
  subtitleIndex:
    'Texte arabe uthmanique et traduction française de Muhammad Hamidullah · 114 sourates',
  titleSurahs: 'Liste des Sourates',
  lastReading: 'Dernière lecture',
  verseOf: (ayah, total) => `Verset ${ayah} sur ${total}`,
  surahProgress: 'Progression dans la sourate',
  continueReading: 'Poursuivre la lecture',
  quickAccess: 'Accès rapide',
  quickAccessSubtitle: 'Sourates fréquemment méditées',
  searchPlaceholder: 'Rechercher une sourate (nom, numéro, traduction)...',
  allJuz: 'Tous les Juz (1–30)',
  filterAll: 'Toutes (114)',
  filterMeccan: 'Mecquoises',
  filterMedinan: 'Médinoises',
  surahsDisplayed: (count) =>
    `${count} sourate${count > 1 ? 's' : ''} affichée${count > 1 ? 's' : ''}`,
  noSurahFound: 'Aucune sourate ne correspond à votre recherche',
  noSurahHint:
    'Essayez un autre nom français, une translittération ou un numéro entre 1 et 114.',
  resetFilters: 'Réinitialiser les filtres',
  modeNight: 'Mode nuit',
  modeDay: 'Mode jour',
  backToSurahs: 'Retour à la liste des sourates',
  surahCountLabel: (num) => `Sourate ${num} sur 114`,
  listenSurah: 'Écouter la sourate',
  pauseAudio: 'Mettre en pause',
  jumpToVerse: 'Aller au verset...',
  verseLabel: (num) => `Verset ${num}`,
  versesCountLabel: (count) => `${count} versets`,
  surahPrefix: (num) => `Sourate ${num}`,
  currentPosition: 'Position actuelle',
  personalNote: 'Note personnelle',
  edit: 'Modifier',
  saveNote: 'Enregistrer la note',
  save: 'Enregistrer',
  cancel: 'Annuler',
  notePlaceholder: 'Écrivez votre réflexion ou un rappel personnel...',
  noteTitleForVerse: (s, a) => `Note personnelle sur le verset ${s}:${a}`,
  changeSurah: 'Changer de sourate',
  readingSettings: 'Paramètres de lecture',
  appLanguageLabel: "Langue de l'application",
  nightModeTitle: 'Mode nuit (thème sombre)',
  nightModeSubtitle: 'Confort visuel en lecture nocturne',
  frenchTranslationTitle: 'Traduction française',
  frenchTranslationSubtitle: 'Muhammad Hamidullah',
  arabicSizeTitle: 'Taille de l’écriture arabe',
  sizeCompact: 'Compact',
  sizeComfortable: 'Confort',
  sizeLarge: 'Grand',
  arabicFontTitle: 'Police du texte arabe',
  latinFontTitle: 'Police français & fulfulde',
  fontPreviewTitle: 'Aperçu des polices',
  reciterTitle: 'Récitateur audio',
  savedPositionLabel: 'Position enregistrée',
  retry: 'Réessayer',
  bookmarksTitle: 'Signets et notes',
  bookmarksSubtitle: (total, withNotes) =>
    `${total} verset${total > 1 ? 's' : ''} enregistré${total > 1 ? 's' : ''} · ${withNotes} avec note personnelle`,
  savedReadingPosition: 'Position de lecture sauvegardée',
  resumeAtVerse: 'Reprendre à ce verset',
  searchBookmarksPlaceholder: 'Rechercher dans vos signets et notes...',
  allBookmarks: (count) => `Tous (${count})`,
  withNotesFilter: (count) => `Avec notes (${count})`,
  noBookmarksTitle: 'Aucun signet enregistré',
  noBookmarksHint:
    'Lors de votre lecture, touchez l’icône signet à côté d’un verset pour le retrouver ici et y associer une note personnelle.',
  browseSurahs: 'Parcourir les sourates',
  noFilteredBookmarks: 'Aucun signet ne correspond à ce filtre',
  showAll: 'Tout afficher',
  readAction: 'Lire',
  savedOn: (date) => `Enregistré le ${date}`,
  revelationLabel: (rev) => rev,
};

const FF_TRANSLATIONS: Translations = {
  appName: 'Alquraana Tedduɗo',
  navSurahs: 'Doggol Suraaji',
  navSurahsShort: 'Suraaji',
  navReader: 'Janngugol Sura',
  navReaderShort: 'Janngugol',
  navBookmarks: 'Maandorɗe',
  navResume: 'Jokkit',
  subtitleIndex:
    'Binndol Aarabeere Usmaaniya e firo Farayse (Muhammad Hamidullah) · Suraaji 114',
  titleSurahs: 'Doggol Suraaji',
  lastReading: 'Janngugol cakkitiingol',
  verseOf: (ayah, total) => `Aaya ${ayah} e nder ${total}`,
  surahProgress: 'Yahdu e nder sura oo',
  continueReading: 'Jokkit janngugol',
  quickAccess: 'Naatirde yaawnde',
  quickAccessSubtitle: 'Suraaji keewɗi janngeede',
  searchPlaceholder: 'Ɗaɓɓit sura (innde, limoore, firo)...',
  allJuz: 'Juzuuji fof (1–30)',
  filterAll: 'Fof (114)',
  filterMeccan: 'Makkaaji',
  filterMedinan: 'Madiinaaji',
  surahsDisplayed: (count) =>
    `Sura${count > 1 ? 'aji' : ''} ${count} hollitaa${count > 1 ? 'ɗi' : 'ɗum'}`,
  noSurahFound: 'Alaa sura nannduɗo e ɗaɓɓitaande maa',
  noSurahHint: 'Etto innde woɗnde walla limoore hakkunde 1 e 114.',
  resetFilters: 'Momtu cuɓe ɗee',
  modeNight: 'Jamma',
  modeDay: 'Ñalawma',
  backToSurahs: 'Rutto to doggol suraaji',
  surahCountLabel: (num) => `Sura ${num} e nder 114`,
  listenSurah: 'Heɗo sura oo',
  pauseAudio: 'Darno',
  jumpToVerse: 'Yah to aaya...',
  verseLabel: (num) => `Aaya ${num}`,
  versesCountLabel: (count) => `Aayeeji ${count}`,
  surahPrefix: (num) => `Sura ${num}`,
  currentPosition: 'Nokku jooni',
  personalNote: 'Tinndinoore hoore maa',
  edit: 'Waylu',
  saveNote: 'Danndu tinndinoore',
  save: 'Danndu',
  cancel: 'Haaytu',
  notePlaceholder: 'Winndu miijo maa walla tinndinoore...',
  noteTitleForVerse: (s, a) => `Tinndinoore e dow aaya ${s}:${a}`,
  changeSurah: 'Waylu sura',
  readingSettings: 'Teelte janngugol',
  appLanguageLabel: 'Ɗemngal kuutoragol',
  nightModeTitle: 'Mbaydi jamma (niɓɓere)',
  nightModeSubtitle: 'Deenki gite e janngugol jamma',
  frenchTranslationTitle: 'Firo Farayse',
  frenchTranslationSubtitle: 'Muhammad Hamidullah',
  arabicSizeTitle: 'Mawnugol binndol Aarabeere',
  sizeCompact: 'Tokoso',
  sizeComfortable: 'Hakkundeejo',
  sizeLarge: 'Mawɗo',
  arabicFontTitle: 'Mbaydi binndol Aarabeere',
  latinFontTitle: 'Mbaydi binndol Farayse & Fulfulde',
  fontPreviewTitle: 'Yiytere mbaydiiji binndol',
  reciterTitle: 'Janoowo daande (Audio)',
  savedPositionLabel: 'Nokku danndaaɗo',
  retry: 'Fuɗɗito',
  bookmarksTitle: 'Maandorɗe e tinndinooje',
  bookmarksSubtitle: (total, withNotes) =>
    `Aayeeji ${total} danndaaɗi · ${withNotes} ina jogii tinndinoore`,
  savedReadingPosition: 'Nokku janngugol danndaaɗo',
  resumeAtVerse: 'Jokkit e oo aaya',
  searchBookmarksPlaceholder: 'Ɗaɓɓit e maandorɗe maa...',
  allBookmarks: (count) => `Fof (${count})`,
  withNotesFilter: (count) => `E tinndinoore (${count})`,
  noBookmarksTitle: 'Alaa maandorde danndaande',
  noBookmarksHint:
    'So aɗa jannga, meeɗ maande maandorde sara aaya ngam danndude ɗum ɗoo e tinndinoore.',
  browseSurahs: 'Yiy doggol suraaji',
  noFilteredBookmarks: 'Alaa maandorde yahdunde e cuɓol ngol',
  showAll: 'Hollit fof',
  readAction: 'Janngude',
  savedOn: (date) => `Danndaa ñalnde ${date}`,
  revelationLabel: (rev) => (rev === 'Mecquoise' ? 'Makka' : 'Madiina'),
};

const AR_TRANSLATIONS: Translations = {
  appName: 'القرآن الكريم',
  navSurahs: 'فهرس السور',
  navSurahsShort: 'السور',
  navReader: 'قراءة السورة',
  navReaderShort: 'القراءة',
  navBookmarks: 'العلامات',
  navResume: 'متابعة',
  subtitleIndex: 'المصحف الشريف بالرسم العثماني مع الترجمة الفرنسية · ١١٤ سورة',
  titleSurahs: 'فهرس السور',
  lastReading: 'آخر قراءة',
  verseOf: (ayah, total) => `الآية ${ayah} من ${total}`,
  surahProgress: 'التقدم في السورة',
  continueReading: 'متابعة القراءة',
  quickAccess: 'وصول سريع',
  quickAccessSubtitle: 'سور يُكثر من تلاوتها',
  searchPlaceholder: 'ابحث عن سورة (بالاسم أو الرقم)...',
  allJuz: 'جميع الأجزاء (١–٣٠)',
  filterAll: 'الكل (١١٤)',
  filterMeccan: 'مكية',
  filterMedinan: 'مدنية',
  surahsDisplayed: (count) => `${count} سورة معروضة`,
  noSurahFound: 'لم يتم العثور على سورة مطابقة للبحث',
  noSurahHint: 'جرّب اسماً آخر أو رقماً بين 1 و 114.',
  resetFilters: 'إعادة ضبط التصفية',
  modeNight: 'الوضع الليلي',
  modeDay: 'الوضع النهاري',
  backToSurahs: 'العودة إلى فهرس السور',
  surahCountLabel: (num) => `السورة ${num} من ١١٤`,
  listenSurah: 'الاستماع للسورة',
  pauseAudio: 'إيقاف مؤقت',
  jumpToVerse: 'الانتقال إلى آية...',
  verseLabel: (num) => `الآية ${num}`,
  versesCountLabel: (count) => `${count} آية`,
  surahPrefix: (num) => `سورة رقم ${num}`,
  currentPosition: 'موضع القراءة',
  personalNote: 'ملاحظة شخصية',
  edit: 'تعديل',
  saveNote: 'حفظ الملاحظة',
  save: 'حفظ',
  cancel: 'إلغاء',
  notePlaceholder: 'اكتب تأملك أو ملاحظتك الشخصية...',
  noteTitleForVerse: (s, a) => `ملاحظة حول الآية ${s}:${a}`,
  changeSurah: 'تغيير السورة',
  readingSettings: 'إعدادات القراءة',
  appLanguageLabel: 'لغة التطبيق',
  nightModeTitle: 'الوضع الليلي (السمة الداكنة)',
  nightModeSubtitle: 'لراحة العين أثناء القراءة الليلية',
  frenchTranslationTitle: 'الترجمة الفرنسية',
  frenchTranslationSubtitle: 'محمد حميد الله',
  arabicSizeTitle: 'حجم الخط العربي',
  sizeCompact: 'صغير',
  sizeComfortable: 'متوسط',
  sizeLarge: 'كبير',
  arabicFontTitle: 'خط النص العربي',
  latinFontTitle: 'خط النص الفرنسي والفولاني',
  fontPreviewTitle: 'معاينة الخطوط',
  reciterTitle: 'القارئ',
  savedPositionLabel: 'الموضع المحفوظ',
  retry: 'إعادة المحاولة',
  bookmarksTitle: 'العلامات والملاحظات',
  bookmarksSubtitle: (total, withNotes) => `${total} آية محفوظة · ${withNotes} بملاحظة`,
  savedReadingPosition: 'موضع القراءة المحفوظ',
  resumeAtVerse: 'المتابعة من هذه الآية',
  searchBookmarksPlaceholder: 'ابحث في العلامات والملاحظات...',
  allBookmarks: (count) => `الكل (${count})`,
  withNotesFilter: (count) => `بملاحظات (${count})`,
  noBookmarksTitle: 'لا توجد علامات محفوظة',
  noBookmarksHint: 'أثناء القراءة، اضغط على أيقونة العلامة بجانب أي آية لحفظها هنا.',
  browseSurahs: 'تصفح السور',
  noFilteredBookmarks: 'لا توجد نتائج مطابقة',
  showAll: 'عرض الكل',
  readAction: 'قراءة',
  savedOn: (date) => `حُفظت في ${date}`,
  revelationLabel: (rev) => (rev === 'Mecquoise' ? 'مكية' : 'مدنية'),
};

export function getTranslations(language: AppLanguage): Translations {
  if (language === 'ff') return FF_TRANSLATIONS;
  if (language === 'ar') return AR_TRANSLATIONS;
  return FR_TRANSLATIONS;
}
