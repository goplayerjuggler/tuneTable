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

N (notes), S (source), and D (discography) header lines are removed from the ABC that's sent to ABCJS.

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

### Copy ABC
Copies the current setting's ABC (with any transposition and bar-length changes applied) to the clipboard. Button label briefly shows "✓ Copied!" for two seconds on success.

### Share
Copies a link that reopens the current setting. Shown only in solo mode, for settings after the first (a plain link to the tune already opens the first), and only when the host app supplies `callbacks.canShare()` and `callbacks.getShareUrl(tune, abcX)`.

The link carries an `abcX` URL parameter holding the setting's `X:` header. An error is raised (as an alert) if the setting has no `X:` header, or if several settings of the tune share the same one. These checks use the settings as stored, not unsaved edits. For tunes without a `ttId` or `theSessionId` the link falls back on a name search, which may match other tunes; the button label warns about this.

### Settings navigation
When a tune has multiple settings (an array of ABC strings), **↑ Previous setting** and **↓ Next setting** buttons appear, along with a `n / total` counter. Navigating commits any transposition on the departing setting before switching.

Arrow keys ↑ / ↓ also navigate settings.

### notes / references
In solo mode only, notes and references (link to audio/video) are shown beneath the score or raw ABC. “ABC references” (references/notes extracted from H, N, D, F, and S ABC headers) are updated for tunes with multiple settings; only the reference from the currently-selected setting is displayed. (Each entry in `tune.referencesFromAbc` is tagged with the index of the ABC setting it was extracted from, and only the entry matching `currentAbcIndex` is shown.) Manually-added references (`tune.references`) are shown alongside the score or raw ABC, regardless of setting.

### Save changes
Appears when any setting has been modified relative to the state at open (dirty detection). Saves all settings in `currentAbcArray`, reprocesses the tune, persists to storage, re-renders the table, and closes the modal.

---

## Opening on a given setting

`openWithTune(tune, { abcX })` opens on the setting whose `X:` header equals `abcX`, which is how `?abcX=` URL parameters are honoured. If no setting, or more than one, matches, a warning is logged and the first setting is shown.

## Pagination

Long scores are split into pages of up to 12 SVG lines each.

Navigation:
- **← Prev** / **Next →** buttons with a page counter (only when there is more than one page). They sit at the bottom right of the last system on the page, overlaid on the last system (absolutely positioned inside an `.abc-last-line` wrapper) so that they take no vertical space (see `#abcPageNav` in the stylesheet).
- Clicking the **left half** of the score goes to the previous page; clicking the **right half** goes to the next. The pointer cursor is shown only when there is more than one page.
- Arrow keys ← / → navigate pages.

The current page and total are shown between the pagination buttons.

---

## Auto-hiding header

The modal header (title bar) hides automatically after opening to maximise the viewing area. It reappears on hover or focus.

---

## Key methods

| Method | Description |
|---|---|
| `openWithTune(tune, { abcX })` | Initialise state and open the modal, optionally on the setting matching `abcX`. Discovers set contexts from `window._setLists`. |
| `selectContext(idx)` | Switch to solo (`0`) or a set context (`1+`). |
| `transpose(semitones)` | Transpose by ±n semitones (solo only). |
| `navigate(direction)` | Move between tune settings: `+1` or `−1` (solo only). |
| `toggleView()` | Switch between rendered and ABC-text views (solo only). |
| `share()` | Copy a link to the current setting (solo only, not the first setting). |
| `copyAbc()` | Copy the current setting's ABC to the clipboard (solo only). |
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
| `formatReference`, `formatNoteLinks` (`utils.js`) | Rendering the notes/references block beneath the score |
| `getAbcX`, `findAbcIndicesByX` (`utils.js`) | Reading and matching `X:` headers, for `abcX` and Share |
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
| `LINES_PER_PAGE` | Number of SVG lines per page (default: `12`). |
