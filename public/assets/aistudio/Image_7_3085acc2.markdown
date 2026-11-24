---
name: Serene Paper & Emerald
colors:
  surface: '#f9f9fd'
  surface-dim: '#d9dade'
  surface-bright: '#f9f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f7'
  surface-container: '#ededf1'
  surface-container-high: '#e8e8ec'
  surface-container-highest: '#e2e2e6'
  on-surface: '#1a1c1f'
  on-surface-variant: '#3f4945'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f0f0f4'
  outline: '#6f7975'
  outline-variant: '#bfc9c4'
  surface-tint: '#22695a'
  primary: '#004337'
  on-primary: '#ffffff'
  primary-container: '#0f5c4d'
  on-primary-container: '#8ed2bf'
  inverse-primary: '#8fd4c1'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdc34d'
  on-secondary-container: '#715000'
  tertiary: '#602b1f'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c4134'
  on-tertiary-container: '#ffb2a1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#abf0dc'
  primary-fixed-dim: '#8fd4c1'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#005143'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f7bd48'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a4'
  on-tertiary-fixed: '#380d05'
  on-tertiary-fixed-variant: '#6f372a'
  background: '#f9f9fd'
  on-background: '#1a1c1f'
  surface-variant: '#e2e2e6'
typography:
  headline-lg:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Literata
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  arabic-verse:
    fontFamily: Amiri
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 48px
  body-lg:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is crafted for a French-language Quran reading mobile application. It is designed for daily readers, students, and contemplative users seeking a distraction-free, respectful, and deeply legible digital reading experience. The interface should evoke the calm of reading from fine-grain paper in natural daylight—peaceful, reverent, and effortless on the eyes.

The visual language is rooted in **Editorial Minimalism** with subtle **Tonal Layering**:
- **Generous Whitespace:** Ample breathing room around Arabic verses and French translations prevents visual fatigue during extended reading sessions.
- **Paper-First Contrast:** Warm, low-glare surfaces replace harsh pure-white backgrounds, while crisp white cards gently elevate interactive controls and verse groupings.
- **Restrained Ornamentation:** Color is used sparingly—deep emerald green anchors primary actions and active states, while warm gold marks sacred milestones, verse numbers, and bookmarks.

## Colors

The palette is built for sustained reading comfort in a light-mode environment, pairing warm paper tones with high-contrast ink and reverent accents.

- **Background & Surfaces:**
  - **Paper Canvas (`#FAF8F5`):** The primary reading background, reducing eye strain compared to stark white.
  - **Elevated Surface (`#FFFFFF`):** Crisp white used for Surah cards, bottom sheets, audio player bars, and modals.
  - **Subtle Surface (`#F2EFE9`):** Used for inactive chips, search bars, and secondary containers.
- **Text & Ink:**
  - **Primary Ink (`#1C1E21`):** High-contrast charcoal for Arabic script and French translation body copy.
  - **Secondary Ink (`#5A5F66`):** Muted slate-charcoal for verse metadata, Surah subtitles, and helper text.
- **Accents:**
  - **Deep Emerald (`#0F5C4D`):** Primary accent for active navigation states, primary buttons, audio playback controls, and active reading progress.
  - **Warm Gold (`#B8860B`):** Secondary accent reserved for verse end markers, bookmark indicators, Juz/Hizb badges, and subtle decorative dividers.

## Typography

Typography is the core of the reading experience, balancing classical Arabic script with crisp, bookish French prose and clean UI controls.

- **Arabic Script (`Amiri` or `Scheherazade New`):** Set at a generous `26px` with a `48px` line height (`~1.85` ratio) to ensure diacritics (harakat) never collide and every letterform remains clear. Always right-aligned (`dir="rtl"`).
- **French Translation (`Literata`):** A warm, scholarly serif designed for extended digital reading. Set at `16px–18px` with generous line height (`26px–30px`) to support effortless scanning and comprehension.
- **UI & Navigation (`Manrope`):** A calm, modern sans-serif used for Surah numbers, tab labels, buttons, and metadata. Keeps interface chrome distinct from sacred text and translation.
- **Mobile Scaling:** All headline levels remain under `28px` so they fit comfortably on mobile viewports without awkward wrapping.

## Layout & Spacing

The layout uses a **fluid single-column reading grid** on mobile, expanding to a centered **fixed-width reading column** (`max-width: 680px`) on tablets to preserve optimal line length (55–65 characters per line for French translations).

- **Margins & Gutters:** A `20px` (`1.25rem`) outer canvas margin provides comfortable thumb-resting space on mobile devices, while `16px` (`1rem`) gutters separate grid items in Surah index views.
- **Vertical Rhythm:** Verses are separated by `24px` (`space-lg`) to `32px` (`space-xl`) of vertical space, creating a calm, unhurried cadence between Arabic text and its French translation.
- **Component Padding:** Cards and interactive containers use `16px` (`space-md`) internal padding, with `8px` (`space-sm`) gaps between related inline elements like verse numbers and action icons.

## Elevation & Depth

Hierarchy is communicated primarily through **Tonal Layering** and **Low-Contrast Outlines**, avoiding heavy drop shadows that would disrupt the flat, paper-like serenity.

- **Tonal Layering:** The warm off-white canvas (`#FAF8F5`) sits at the base. Crisp white cards (`#FFFFFF`) rest on top for Surah lists, verse-of-the-day highlights, and audio controls.
- **Ghost Borders:** Subtle `1px` borders in `#E6E1D8` define card edges and dividers without creating visual noise.
- **Ambient Shadows:** Reserved strictly for floating elements such as the persistent mini audio player and bottom sheets, using a soft, diffused shadow (`0 4px 20px rgba(28, 30, 33, 0.06)`).

## Shapes

The design system uses a **Rounded (`2`)** shape language to soften the interface and evoke a welcoming, gentle feel.

- **Cards & Containers:** `16px` (`1rem`, `rounded-lg`) corner radius on Surah cards, translation blocks, and modal sheets.
- **Buttons & Inputs:** `8px` (`0.5rem`) corner radius for standard buttons and search inputs.
- **Chips & Badges:** Pill-shaped (`9999px`) for Juz/Hizb filter chips and verse number badges.

## Components

- **Buttons:**
  - *Primary:* Solid Deep Emerald (`#0F5C4D`) fill, crisp white `#FFFFFF` label in `Manrope` (`label-lg`), `8px` radius, `48px` minimum touch target.
  - *Secondary / Ghost:* Transparent fill with `#0F5C4D` text and a subtle `#E6E1D8` border, or text-only for inline verse actions (Share, Bookmark, Play).
- **Verse Block (Product-Specific):**
  - Displays the Arabic verse right-aligned at the top, followed by the Warm Gold (`#B8860B`) verse-end marker, and the French translation left-aligned below in `Literata`.
  - Subtle `1px` `#E6E1D8` divider separates consecutive verses.
- **Cards:**
  - Crisp white (`#FFFFFF`) background, `16px` radius, `1px` `#E6E1D8` border, and `16px` internal padding. Used for Surah index rows and reading-progress summaries.
- **Chips:**
  - Used for Surah/Juz filtering and quick navigation. Inactive chips use `#F2EFE9` with `#5A5F66` text; active chips use `#0F5C4D` with `#FFFFFF` text.
- **Lists:**
  - Surah index rows feature the Surah number inside a subtle Warm Gold or Emerald-tinted badge on the left, French title and verse count in the center, and calligraphic Arabic Surah name on the right.
- **Input Fields:**
  - Search bars use `#F2EFE9` fill, `8px` radius, `#5A5F66` placeholder text, and `#0F5C4D` focus ring.
- **Checkboxes & Radio Buttons:**
  - Used in reading settings (e.g., toggling French translation visibility, selecting reciter). Active states fill with Deep Emerald (`#0F5C4D`).
- **Mini Audio Player (Product-Specific):**
  - Floating crisp white bar above the bottom navigation with ambient shadow, displaying current Surah, reciter name, Emerald play/pause button, and a thin `#0F5C4D` progress bar.