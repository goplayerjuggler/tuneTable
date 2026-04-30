# AbcModal

`src/modules/modals/AbcModal.js`

Modal for viewing and editing ABC notation as rendered sheet music. Extends the base `Modal` class.

---

## Modes

The modal operates in one of two modes, switchable via the context-selector row when applicable.

### Solo mode (default)

Displays the tune that was clicked. All editing controls are available: transpose, bar-length toggle, ABC text view, settings navigation, and save.

### Set mode

Displays all tunes in a set as a single concatenated score. The tunes are read from `window.tunesData` using each set-list entry's preferred setting (resolved via `resolveAbcForEntry` from `setUtils.js`). Editing controls are hidden; pagination still works.

The directive `%%writefields NSD false` is prepended to suppress N (notes), S (source), and D (discography) header lines from the rendered score.

---

## Context selector

When the current tune belongs to one or more sets in `window._setLists`, a row of buttons appears above the main controls:

- **This tune** — returns to solo mode.
- **Set: [name]** — switches to set mode for that set. Hovering the button shows the name of the set list it belongs to.

Sets are deduplicated by their tunes-array content. If the same tunes appear in multiple set lists, only the first occurrence is shown (its set-list name appears as a tooltip).

---

## Solo-mode controls

### Transpose
Semitone-by-semitone transposition up (♯) or down (♭). Transpositions accumulate: pressing ♯ twice gives +2 semitones. The base (`currentTuneAbc`) is held fixed; only `currentTransposedAbc` changes, ensuring cumulative correctness.

### Bar length
**Double bar length** / **Halve bar length** buttons appear only when the conversion is valid for the current ABC. These modify `currentTuneAbc` directly and reset the transposition base, so subsequent transposes work from the new bar length.

### View toggle
Switches between the rendered score and a plain-text view of the raw ABC source. The text view reflects the current transposed state.

### Settings navigation
When a tune has multiple settings (an array of ABC strings), **↑ Previous setting** and **↓ Next setting** buttons appear, along with a `n / total` counter. Navigating commits any transposition on the departing setting before switching.

Arrow keys ↑ / ↓ also navigate settings.

### Save changes
Appears when any setting has been modified relative to the state at open (dirty detection). Saves all settings in `currentAbcArray`, reprocesses the tune, persists to storage, re-renders the table, and closes the modal.

---

## Pagination

Long scores are split into pages of up to 12 SVG lines each.

Navigation:
- **← Prev page** / **Next page →** buttons (appear only when there is more than one page).
- Clicking the **left half** of the score goes to the previous page; clicking the **right half** goes to the next.
- Arrow keys ← / → navigate pages.

The current page and total are shown between the pagination buttons.

---

## Auto-hiding header

The modal header (title bar) hides automatically after opening to maximise the viewing area. It reappears on hover or focus.

---

## Key methods

| Method | Description |
|---|---|
| `openWithTune(tune)` | Initialise state and open the modal. Discovers set contexts from `window._setLists`. |
| `selectContext(idx)` | Switch to solo (`0`) or a set context (`1+`). |
| `transpose(semitones)` | Transpose by ±n semitones (solo only). |
| `navigate(direction)` | Move between tune settings: `+1` or `−1` (solo only). |
| `toggleView()` | Switch between rendered and ABC-text views (solo only). |
| `nextPage() / prevPage()` | Advance or retreat one page. |
| `save()` | Persist all modified settings and close. |

---

## Dependencies

| Import | Used for |
|---|---|
| `@goplayerjuggler/abc-tools` | Bar-length conversion and validation |
| `abcjs` | Rendering ABC and transposition |
| `Modal` | Base modal class |
| `reprocessTune` (`processTuneData.js`) | Updating tune metadata after save |
| `resolveAbcForEntry`, `tuneMatchesEntry` (`setUtils.js`) | Set-list entry resolution |

`setUtils.js` is also imported by `TuneSelectionsModal.js`, which should use the same exported `findTuneByEntry` instead of its local copy.

---

## State reference

| Variable | Description |
|---|---|
| `tune` | The tune object passed to `openWithTune`. |
| `currentAbcArray` | Working copy of all settings; updated on navigate and save. |
| `originalAbcArray` | Immutable snapshot at open, used for dirty detection. |
| `currentAbcIndex` | Index of the currently displayed setting. |
| `currentTuneAbc` | Pre-transposition base for the active setting. |
| `currentTransposedAbc` | `currentTuneAbc` transposed by `currentTranspose`. |
| `currentTranspose` | Accumulated semitone offset from the base. |
| `setContexts` | Array of `{ setListName, setName, tunes }` objects. |
| `currentContextIndex` | `0` = solo; `1+` = set at `setContexts[idx - 1]`. |
| `allSvgs` | All SVG lines from the last render, used for pagination. |
| `currentPage` | Zero-based current page index. |
| `LINES_PER_PAGE` | Number of SVG lines per page (default: `9`). |
