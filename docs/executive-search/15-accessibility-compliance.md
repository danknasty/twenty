# 15 — Accessibility Compliance

## Purpose

Accessibility verification checklist for the Executive Search Operating System frontend. Target: WCAG 2.1 AA compliance.

## Scope

All executive-search UI surfaces in `packages/twenty-front/src/modules/` including:
- Candidate profiles and search
- Candidacy pipeline views
- Client collaboration screens
- Assignment management
- Board composition views
- Analytics dashboards (Phase 14)

## WCAG 2.1 AA Checklist

### Perceivable

| # | Criterion | Level | Check | Verified |
|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | All images have alt text; icons have aria-labels | [ ] |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | Interview recordings have transcripts | [ ] |
| 1.3.1 | Info and Relationships | A | Form inputs have labels; tables have headers | [ ] |
| 1.3.2 | Meaningful Sequence | A | Reading order is logical in all views | [ ] |
| 1.3.3 | Sensory Characteristics | A | Instructions don't rely solely on color/shape | [ ] |
| 1.4.1 | Use of Color | A | Color is not the only means of conveying info | [ ] |
| 1.4.3 | Contrast (Minimum) | AA | Text contrast ratio ≥ 4.5:1; large text ≥ 3:1 | [ ] |
| 1.4.4 | Resize Text | AA | Text resizes to 200% without loss of function | [ ] |
| 1.4.5 | Images of Text | AA | No images of text used (except logos) | [ ] |
| 1.4.10 | Reflow | AA | Content reflows at 320px width without horizontal scroll | [ ] |
| 1.4.11 | Non-text Contrast | AA | UI components have ≥ 3:1 contrast against adjacent colors | [ ] |
| 1.4.12 | Text Spacing | AA | Line height ≥ 1.5, paragraph spacing ≥ 2x, letter spacing ≥ 0.12x | [ ] |
| 1.4.13 | Content on Hover or Focus | AA | Tooltips dismissible, hoverable, persistent | [ ] |

### Operable

| # | Criterion | Level | Check | Verified |
|---|---|---|---|---|
| 2.1.1 | Keyboard | A | All functionality operable via keyboard | [ ] |
| 2.1.2 | No Keyboard Trap | A | Focus can move away from any component | [ ] |
| 2.2.1 | Timing Adjustable | A | No session timeouts without warning and extension | [ ] |
| 2.2.2 | Pause, Stop, Hide | A | Auto-updating content can be paused | [ ] |
| 2.3.1 | Three Flashes or Below Threshold | A | No content flashes more than 3 times/second | [ ] |
| 2.4.1 | Bypass Blocks | A | Skip navigation link available | [ ] |
| 2.4.2 | Page Titled | A | Every page has a descriptive `<title>` | [ ] |
| 2.4.3 | Focus Order | A | Focus order follows visual layout | [ ] |
| 2.4.4 | Link Purpose (In Context) | A | Link text describes destination | [ ] |
| 2.4.5 | Multiple Ways | AA | Multiple ways to locate pages (nav, search, sitemap) | [ ] |
| 2.4.6 | Headings and Labels | AA | Headings and labels describe topic/purpose | [ ] |
| 2.4.7 | Focus Visible | AA | Keyboard focus indicator is visible | [ ] |
| 2.5.3 | Label in Name | A | Accessible name contains visible label text | [ ] |

### Understandable

| # | Criterion | Level | Check | Verified |
|---|---|---|---|---|
| 3.1.1 | Language of Page | A | `<html lang>` attribute set correctly | [ ] |
| 3.2.1 | On Focus | A | No context change on focus | [ ] |
| 3.2.2 | On Input | A | No context change without warning on input change | [ ] |
| 3.2.3 | Consistent Navigation | AA | Navigation order consistent across pages | [ ] |
| 3.2.4 | Consistent Identification | AA | Components with same function identified consistently | [ ] |
| 3.3.1 | Error Identification | A | Form errors described in text | [ ] |
| 3.3.2 | Labels or Instructions | A | Input fields have labels or instructions | [ ] |
| 3.3.3 | Error Suggestion | AA | Error messages suggest correction | [ ] |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Reversible, checked, confirmed before submission | [ ] |

### Robust

| # | Criterion | Level | Check | Verified |
|---|---|---|---|---|
| 4.1.1 | Parsing | A | No duplicate IDs; elements properly nested | [ ] |
| 4.1.2 | Name, Role, Value | A | ARIA roles, states, properties correct | [ ] |
| 4.1.3 | Status Messages | AA | Status messages announced via aria-live | [ ] |

## Automated Testing

```bash
# Run axe-core automated accessibility audit
yarn workspace twenty-front test:a11y

# Run Lighthouse accessibility audit (target ≥ 90)
yarn lighthouse http://localhost:3001 --only-categories=accessibility
```

## Manual Testing

Key workflows to test with screen reader (NVDA/VoiceOver) and keyboard-only:

1. **Candidate search** → find candidate, open profile, view details
2. **Candidacy pipeline** → move candidate through stages
3. **Client collaboration** → view shared records, provide feedback
4. **Board composition** → view matrix, evaluate candidates
5. **Analytics dashboards** → navigate charts and tables

## Known Issues Tracking

| Issue | Severity | WCAG Criterion | Status |
|---|---|---|---|
| TBD | — | — | — |
