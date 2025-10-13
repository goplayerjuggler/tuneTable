# Tune table
An interactive HTML/Javascript viewer for lists of tunes. It uses data in a hybrid format where tunes can either be given in [ABC format](https://abcnotation.com) or otherwise with just some simple descriptions/comments/links. 

## Features: 
* tunes can have zero, one or more settings in ABC
* a popup score viewer with transpose buttons, for tunes with one or more settings in ABC
* sorting and filtering of the tune list
* incipit generator (incipit: a short score giving the first few notes)
* comments/notes for tunes, optionally with links to audio references
* optional external links to scores
* all entries can be fully edited within the tool
* import & export functions
  * lists of tunes in ABC format can be imported
  * complete data for the current tune list can be exported/imported in Javascript literal or JSON format
  * integration with thesession.org: load a member’s tune book or one specific tune
* persistence: all changes to the tune list are automatically saved (to `localStorage`) so you can close the browser, or reboot, and still see your most recent list the next time you load the page

## Upcoming features / wishlist
Here are some features I hope to add at some point:
* sort tunes based on the actual tune, in a key- and mode-agnostic manner – I have in mind a way of sorting tunes that I haven’t seen implemented, or even described, anywhere else.
* load preset lists of tunes
* meter and bar length switcher: e.g. for reels, toggle between 4/4 + quavers,  4/4 + semiquavers, and 4/2 + quavers. The first option is the standard way, but I often prefer the other two options.

## Live demo
Live demo here: [goplayerjuggler.github.io/tuneTable](https://goplayerjuggler.github.io/tuneTable/).

### Query parameters `n` (name), `q` (query) and `g` (group)
* You can open a specific tune directly by specifying part of its name, eg: 
[goplayerjuggler.github.io/tuneTable/?n=cameronian](https://goplayerjuggler.github.io/tuneTable/?n=cameronian) 
* query everything that matches with `q` in the URL:
[goplayerjuggler.github.io/tuneTable/?q=crooked](https://goplayerjuggler.github.io/tuneTable/?q=crooked)
* the `g` parameter limits the list to a sublist, those tunes whose `groups` are matches. This is meant to be used for sharing only some of the list with a target audience. Example: 
[goplayerjuggler.github.io/tuneTable/?g=alora](https://goplayerjuggler.github.io/tuneTable/?g=alora) 
Unlike the other pages, other tunes are no longer accessible.

## Current default list of tunes
It’s a hodgepodge list of tunes I either like, am interested in, or want to share with some musicians, or … 
A fair number of the scores there are my own work, either transcriptions of other people’s tunes or original pieces. I reserve some rights on this via a CC licence; details below.

The current default list of tunes can be changed easily using the tool’s edit and import functionalities.

## Code status
This project is in the alpha stage of development. Which is one reason why I haven’t yet done any publicity for it.

## Dev notes
I used Claude.ai to do a lot of the dev work. Tune rendering and transposing is done by [abcjs](https://github.com/paulrosen/abcjs), a library written by by Paul Rosen and Gregory Dyke.

A tip of the hat to: 

* Michael Eskin and his amazing and indispensable online ABC editor, [ABC tools](https://michaeleskin.com/app/abctools.html), which no doubt is part of the inspiration behind this. Michael has already kindly given me a few tips on several details; and I adapted his code to write the incipit generator.

* Anton Bregolas, whose [TuneTable](https://anton-bregolas.github.io/Tunetable/) inspired me to set up “import from thesession.org”.

* Jeremy from [thesession.org](https://thesession.org) for providing such an great resource and helping me with a question about it.


## Licenses

This project uses dual licensing:

- **Code (JavaScript, HTML, CSS)**: [MIT License](LICENSE-CODE)
- **Tune list data (.json.js files)**: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](LICENSE-DATA)

### What this means:

**Code**: Can be freely used, modified, and distributed (see MIT License terms)

**Tune list data**: Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), which means:
- **BY** (Attribution): You must give appropriate credit to the original creator
- **NC** (NonCommercial): You may not use the data for commercial purposes
- **SA** (ShareAlike): If you remix or build upon the data, you must distribute your contributions under the same CC BY-NC-SA 4.0 license


## Setup notes
```
npm install
npm run dev
npm run build
```