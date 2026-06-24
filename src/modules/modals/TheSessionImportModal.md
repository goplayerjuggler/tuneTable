# theSession.org import — feature documentation

_Documentation for the **Import from thesession.org** modal in tuneTable._

---

## Overview

The **Import from thesession.org** modal connects tuneTable to [thesession.org](https://thesession.org), a community database of Celtic traditional music. It has two modes, accessible via tabs:

- **Import tunes** — fetch individual tunes or a member's full tunebook, and add their ABC notation to your tune library.
- **Import sets** — fetch a member's set lists (or specific sets by ID) and add them to your set-list manager, preserving the exact setting references from thesession.

---

## Import tunes

### What it does

Each tune on thesession.org may have dozens of user-contributed ABC settings (transcriptions). This import mode fetches the ABC for one or more tunes, applies a configurable selection strategy to pick the best setting(s), and adds the resulting tune objects to your library.

### Inputs

| Field | Required | Description |
|-------|----------|-------------|
| User ID | Optional | A thesession.org member ID (numeric) or username. When provided, the import works from that member's tunebook. Supplying only a User ID imports their full tunebook up to the maximum count. |
| Tune ID(s) | Optional | One or more tune IDs (space- or comma-separated). Bypasses the tunebook lookup and fetches these tunes directly. A User ID may also be provided to narrow setting selection to that member's contributions. |
| Setting ID | Optional | A single setting ID. Only used when exactly one Tune ID is given. Forces import of that specific transcription. |
| Maximum tunes | — | Caps the number of tunes imported in a single run (default 100). |

At least one of _User ID_ or _Tune ID(s)_ must be supplied.

### Setting selection strategy

When no explicit Setting ID is given, the importer applies a ranked-filter strategy to choose the best available setting:

1. If a User ID is supplied and `importAllSettingsForSpecifiedUser` is enabled, _all_ of that member's settings for each tune are imported (producing a `tune.abc` array).
2. Otherwise, the candidate list is narrowed by `settingChoiceCriteria` in order: preferred user IDs (first matching user wins), chord presence, length preference, date. Each criterion is skipped if it would leave no candidates.
3. If no criterion narrows the list to one, the first remaining candidate is used.

### Bar-length doubling

When `doubleBarLengthWherePossible` is enabled, eligible reels, jigs, polkas, and hornpipes have their bar length doubled after import.

### Skip behaviour

The `skipLevel` setting controls how duplicates are handled:

| Value | Behaviour |
|-------|-----------|
| `ifAbcExists` | Skip the tune entirely if any version is already in the library. _(Default.)_|
| `ifTuneExists` | Skip the tune entirely if any version is already in the library. |
| `ifSettingExists` | Skip only if the exact setting is already present. If the tune exists but not this setting, the new ABC is _appended_ to the tune's `abc` array rather than creating a duplicate entry.  |

### Import settings override

The default settings are conservative (no preferred users, no bar-length doubling). To apply personal preferences persistently, store a JSON object in `localStorage` under the key `theSessionImportSettings`. Any keys present override their defaults; omitted keys fall back to the defaults. Example (browser console):

```js
localStorage.setItem('theSessionImportSettings', JSON.stringify({
    doubleBarLengthWherePossible: true,
    importAllSettingsForSpecifiedUser: true,
    settingChoiceCriteria: [
        { preferredUserIds: [[40345, "GoPlayerJuggler"], [1, "Jeremy"]] },
        "withChords",
        "preferShorter"
    ]
}));
```

---

## Import sets

### What it does

Fetches one or more set lists from thesession.org and merges them into tuneTable's set-list manager. Each imported set references the _specific setting_ used on thesession (by setting ID), so the correct transcription is displayed in the set-list view — even when the tune has multiple settings in your library.

### Inputs

| Field | Required | Description |
|-------|----------|-------------|
| Member ID | Optional | A thesession.org member ID. Imports that member's most recent sets, up to the maximum. |
| Set IDs | Optional | Comma-separated set IDs. Takes priority over Member ID when both are provided. |
| Max sets | — | Maximum sets to import when using Member ID (default 3). |

### Behaviour per tune in an imported set

- **Tune and setting already in library:** the entry is added to the set as-is; no ABC fetch is performed.
- **Tune in library but the specific setting is absent:** the setting's ABC is fetched automatically and appended to `tune.abc`, respecting the active import settings.
- **Tune not in library:** the tune is fetched and imported in full using the same pipeline as a manual tune import. The tune name is reported in the status summary as newly imported.
