# Tune table
A web page for managing tune libraries. It displays tunes using standard music notation. Notable features include transposition buttons; set lists (tunes arranged into sets) with Print to PDF; import from [thesession.org](https://thesession.org), and more – details below.

Tune data is based on [ABC format](https://abcnotation.com/wiki/abc:standard:v2.1) that’s wrapped in Javascript objects. 

In my opinion the most notable/original feature is how the tool sorts tunes. It’s based on something I call the _contour_ of a tune: the melodic shape relative to the tonic, abstracted away from key and mode.

The tool is “standalone”: it sends no messages back to any server while it is being used.  

This project is in the alpha stage of development. 

## Live demo
Live demo here: [goplayerjuggler.github.io/tuneTable](https://goplayerjuggler.github.io/tuneTable/).

## Who is this for
Primarily, I built this for myself as a way of organising repertoire I’m interested in, and to help me share it with other musicians. I believe it will also help other musicians organise and share repertoire.

## Features
* sort tunes based on the tune’s _contour_ w.r.t. to the tonic:
  * key and mode agnostic; also to some extent octave agnostic – more details [here](https://github.com/goplayerjuggler/abc-tools/blob/main/docs/contour_sort.md).
  * contours are displayed next to the tune’s title
  * can toggle between “contour” sorting and simple sorting by the tune name
* incipits (incipit: a short score giving the first few notes) are shown next to tune titles. They are extracted by the tool from a full score; optionally they can instead  be given explicitly as part of the tune data.
* a popup score viewer with transpose buttons, for tunes with one or more settings in ABC. Long scores are paginated.
* search/filtering by full text / key / rhythm
* tunes may have additional information such as comments/notes; tags; and external links to recordings, scores and other databases like thesession.org.
* tunes can be partially edited within the tool inside a basic editor.
* import & export functions
  * lists of tunes in ABC format can be imported
  * tune lists can be exported/imported using a custom Javascript format
  * export data for one single tune, or one single set list
  * integration with thesession.org: load a member’s tune book or one specific tune; load a member’s sets
* a set list creation and management feature that allows users to select tunes from the main table and arrange them into ordered sets for sessions, or gigs, or classes, or other events. With Print functionalities too. 
* bar length switcher: toggle between standard bar lengths, and bars that are twice as long, which I often prefer. For the moment this feature is limited to reels, jigs, polkas, and hornpipes. For reels, it also converts quavers to semiquavers.
* persistence: all changes to the tune list are automaticaly saved to your browser’s local storage so you can close the browser, or reboot, and still see your most recent list the next time you load the page with that device. Changes to set lists are not automaticallty saved, but can be by clicking on a Save button.
* any and all changes made to tunes and tune lists work on a local version; no data is sent elsewhere; and there is a menu command to revert back to the initial data (the default tune list).

### Query parameters `n` (name), `q` (query) and `g` (group)
* You can open a specific tune directly by specifying part of its name, eg: 
[goplayerjuggler.github.io/tuneTable/?n=cameronian](https://goplayerjuggler.github.io/tuneTable/?n=cameronian) 
* query everything that matches a full-text search with `q` in the URL:
[goplayerjuggler.github.io/tuneTable/?q=crooked](https://goplayerjuggler.github.io/tuneTable/?q=crooked)
* the `g` parameter limits the list to a sublist: those tunes whose `groups` field matches. This is meant to be used for sharing only some of the list with a target audience. Example: 
[goplayerjuggler.github.io/tuneTable/?g=alora](https://goplayerjuggler.github.io/tuneTable/?g=alora) 
Unlike the other query parameters, with this option the other tunes that do not match are no longer accessible.

## Upcoming features / wishlist
Here are some features I would like to have:
* local storage tune lists management
* user preferences for display, import, and PDF output.
* provide several incipits for a single tune - indexing by B, C parts etc.
* other UI improvements like an advanced search feature; optimising browser resources by only rendering graphical elements as needed; …
* features for sharing tune lists from other people / other repos.
* parsing of ABC to determine the structure of a tune - i.e. is it made up of parts ABCDE, or AABB, or something else.
* a feature to format ABC code (this would go in the `abcTools` repo; but would be handy here, e.g. to improve the beaming in the end result when a reel is switched to 4/4 with semiquavers).

## Current list of tunes
It’s a hodgepodge list of tunes I either like, am interested in, or want to share with some musicians, or … 
A fair number of the scores there are my own work, either transcriptions of other people’s tunes or original pieces. I reserve some rights on this via a CC licence; details below.

I try to provide at least one setting or incipit for each tune.

A good proportion of the tune settings was loaded from [thesession.org](https://thesession.org) based on my tune book there; but I haven’t yet gone systematically through all the tunes to check important things like the key – for contour sorting, it makes a big difference, e.g. having `K:G` instead of `K: Dmix`! But I believe the key is mostly correct.

## Thanks
Thanks to: 

* Michael Eskin and his amazing online ABC editor, [ABC tools](https://michaeleskin.com/app/abctools.html), which no doubt is part of the inspiration behind this. Michael has already kindly given me a few tips on several details; and I used some of his code when building the incipit generator.

* Anton Bregolas, whose [TuneTable](https://anton-bregolas.github.io/Tunetable/) inspired me to set up “import from thesession.org”.

* Jeremy from [thesession.org](https://thesession.org) for providing such an great resource and helping me with a question about it.

* Gilles Raymond for requesting the set list & print feature.
* Anthropic: this tool was built with significant assistance from Claude.ai.
* Github for hosting this repo.

## Licenses

This project uses dual licensing:

- **Code (JavaScript, HTML, CSS)**: [MIT License](LICENSE-CODE)
- **Tune list data (.data.js files)**: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](LICENSE-DATA)

### What this means:

**Code**: Can be freely used, modified, and distributed (see MIT License terms)

**Tune list data**: Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), which means:
- **BY** (Attribution): You must give appropriate credit to the original creator
- **NC** (NonCommercial): You may not use the data for commercial purposes
- **SA** (ShareAlike): If you remix or build upon the data, you must distribute your contributions under the same CC BY-NC-SA 4.0 license


## Dev notes
### Dependencies
Tune rendering and transposing is done by [abcjs](https://github.com/paulrosen/abcjs), a library written by Paul Rosen and Gregory Dyke.

Most of the other functionality related to ABC is in my [“abc-tools” repo](https://github.com/goplayerjuggler/abc-tools).

### npm
``` PowerShell
# setup
npm install
# run local version
npm run dev
# build
npm run build
# working with abc-tools
npm link ..\abctools
## check the link
npm ls --global
## remove and recreate the link
npm uninstall -g  @goplayerjuggler/abc-tools # seems to be needed each time the abc-tools’ version is bumped
```

### Using other tunes
It should be fairly easy to adapt this to other tune lists. One way would be: clone this repo and replace its tune data with your own tune data. For this I would advise starting inside the tool by loading tunes in ABC format, and exporting the data in Javascript format. Then in VS Code, run a script (`split-tunes.mjs`) to get the `.data.js` files. I may write a more detailed guide for this at some point.
