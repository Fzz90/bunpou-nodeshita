# Bunpou Jawir: ～のでした (Design Direction)

## Brief
Seven presentation slides in Indonesian for **Faiz Syihab, NIM 125241046, Kelas A** (`Bunpou Jawir`). Teach **～のでした** (meaning, two primary functions, conjugation rules, contextual examples), introduce **similar Japanese grammar patterns** (**～のです / ～んです**, **～からだった / ～ためだった**, **～わけだった**, plus register variants **～のだった / ～んでした** and plain **～ました**), and demonstrate **how to distinguish them** through live scenario comparison. No practice quizzes or exercise slides. Static HTML/CSS/JS presentation ready for local viewing, print/PDF export, and GitHub Pages.

## Design Read & Dials
Reading this as: **interactive Japanese grammar monograph deck** for **university learners**, in an **editorial printed-annual style rooted in Bunpou Jawir's visual system**, dial **ENERGY 2 / RHYTHM 3 / MOTION 2**.

## Visual System (kept from Bunpou Jawir / bunpou-tm6)
- **Ink (`--ink`)**: `#292743` (primary display & body copy)
- **Muted (`--muted`)**: `#534F6B` (verified >= 6.6:1 on `#ECECF6`, >= 7.7:1 on `#FFFFFF`)
- **Cobalt (`--cobalt`)**: `#4444DE` (Japanese hero display, primary function field, focal accent, primary CTA)
- **Lavender (`--lavender`)**: `#ECECF6` (slide stage ground; outer canvas `#F5F5FA`)
- **Lavender Deep (`--surface-deep`)**: `#E2E0F0` (secondary editorial zones & tonal dividers)
- **Lilac (`--lilac`)**: `#CDC4ED` (folded origami paper rosette tones)
- **Citron (`--citron`)**: `#E2EDAB` (cover disc, contrast highlight block, narrative marker; Ink `#292743` & Sage `#3A4708` verified > 8:1)
- **White (`--white`)**: `#FFFFFF` (analytical reading surfaces)
- **Type**: `Gentium Book Plus` (Latin display & Indonesian prose, fallback `Georgia, serif`) + `Huninn` (Japanese display, grammar formulas, & ruby furigana, fallback `'Yu Gothic', Meiryo, sans-serif`).

## Layout & Composition Rhythm
Every slide uses a 16:9 desktop stage (`1440×810` scaled responsively via `--deck-scale`) and reflows cleanly as stacked vertical reading pages below `900px`:
1. **Pembuka**: Asymmetric 60/40 masthead split with giant `～のでした`, vertical motto (`ことばに、気づきを。`), and crisp flat-fold paper rosette.
2. **Makna**: Asymmetric focal contrast (dominant Cobalt panel for *Kesadaran Baru* vs stacked White + Citron panels for *Latar Belakang & Asal Struktur*).
3. **Rumus**: Two-track morphological grouping (`V & Adj-い` vs `N & Adj-な`) with live Tense Switcher (`Kini / Fakta` ↔ `Lampau`) and animated step-transformation sliders.
4. **Contoh**: 2×3 contextual sentence grid with toggleable `<ruby>` furigana and function highlights.
5. **Bunpou Mirip**: Editorial four-column tonal spectrum comparing `～のでした`, `～のです`, `～からだった`, and `～わけだった` plus register notes.
6. **Cara Membedakan**: Left decision-rule axis paired with an interactive Scenario Distinction Lab letting the presenter switch scenarios and compare all four patterns live.
7. **Penutup**: Full-bleed Cobalt closing sheet with paper rosette, presenter signature, and restart control.

## Interaction, Accessibility & Print
- Keyboard navigation: `ArrowLeft`/`ArrowRight`, `PageUp`/`PageDown`, `Home`/`End`, `Space`/`Shift+Space`, `F` (fullscreen), plus header toggle for `ふりがな`.
- Touch swipe on mobile (`> 75px`), >= 44px interactive controls, WCAG AA verified contrast (`>= 5.08:1` across all pairings), high-contrast `:focus-visible` outlines, and full `prefers-reduced-motion: reduce` support.
- Print stylesheet prepares 7 landscape pages (`320mm × 180mm`) with hidden chrome and static print fallback for interactive states.
