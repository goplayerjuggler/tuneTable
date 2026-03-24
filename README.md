# Tune table
A web page for managing tune libraries. It displays tunes using standard music notation. Notable features include transposition buttons; set lists (tunes arranged into sets) with Print to PDF; import from [thesession.org](https://thesession.org), and more – details below.

Tune data is based on [ABC format](https://abcnotation.com/wiki/abc:standard:v2.1) that’s wrapped in Javascript objects. 

In my opinion the most notable/original feature is how the tool sorts tunes. It’s based on something I call the _contour_ of a tune: the melodic shape relative to the tonic, abstracted away from key and mode. It’s a sort of [graphical score](https://en.wikipedia.org/wiki/Graphic_notation_(music)) that’s derived automatically from an incipit (a short score giving the first few notes of the tune).

The tool is “standalone”: it can load data but it never sends any data back in the other directions.

This project is in the alpha stage of development. 

## Live demo
Live demo here: [goplayerjuggler.github.io/tuneTable](https://goplayerjuggler.github.io/tuneTable/).

## Who this is for
I built this for myself as a way of exploring and organising repertoire I’m interested in, and to help me with music groups I’m involved in. I also wanted to experiment with things like contour sorting. I believe it will also help other musicians explore, organise and share repertoire.

## Features
* sort tunes based on the tune’s _contour_ w.r.t. to the tonic:
  * key and mode agnostic; also to some extent octave agnostic – more details [here](https://github.com/goplayerjuggler/abc-tools/blob/main/docs/contour_sort.md).
  * contours are displayed next to the tune’s title
  * switch between “contour” sorting and simple sorting by the tune name, by successive clicks on the first column header of the main table.
* incipits  are shown next to tune titles. They are extracted by the tool from a full score; optionally they can instead  be given explicitly as part of the tune data.
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
* tune list management: users can switch between lists of tunes hosted online, and their own local lists of tunes.
* lazy loading of SVGs for incipits and contours in order avoid excessive memory usage when viewing a list with thousands of tunes.

### Query parameters `n` (name), `q` (query), `l` (list) and `g` (group)
* You can open a specific tune directly by specifying part of its name, eg: 
[goplayerjuggler.github.io/tuneTable/?n=cameronian](https://goplayerjuggler.github.io/tuneTable/?n=cameronian) 
* query everything that matches a full-text search with `q` in the URL:
[goplayerjuggler.github.io/tuneTable/?q=crooked](https://goplayerjuggler.github.io/tuneTable/?q=crooked)
* the `g` parameter selects a “server list” that was prepared based on the `tune.groups` property. Example: 
[goplayerjuggler.github.io/tuneTable/?g=alora](https://goplayerjuggler.github.io/tuneTable/?g=alora) 
* the `l` parameter selects any “server list”. Example: 
[goplayerjuggler.github.io/tuneTable/?l=default](https://goplayerjuggler.github.io/tuneTable/?l=default)
* Parameters can be combined. Example: 
[load Darby the driver from the default list](https://goplayerjuggler.github.io/tuneTable/?l=default&n=darby+the+driver) 


## Upcoming features / wishlist
Here are some features I would like to have:
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
* Paul Rosen and Gregory Dyke for their fantastic library [abcjs](https://github.com/paulrosen/abcjs). These days it’s behind most of the online resources related to ABC.
* Michael Eskin for his amazing online ABC editor, [ABC tools](https://michaeleskin.com/app/abctools.html), which no doubt is part of the inspiration behind this. Michael has already kindly given me a few tips on several details; and started with some of his code when building the incipit generator.
* Anton Bregolas, whose [TuneTable](https://anton-bregolas.github.io/Tunetable/) inspired me to set up “import from thesession.org”. More recently, I see he’s published other projects such as the [Novi Sad Session Setlist App](https://ns.tunebook.app/) – a very well done app, with some parallels with this project. ([github](https://github.com/anton-bregolas/NS-Session-Setlist)).
* Jeremy from [thesession.org](https://thesession.org) for providing such an great resource and helping me with a question about it.
* Gilles Raymond for requesting the set list & print feature.
* Anthropic: roughly 95% of the code here was written by Claude.ai / Sonnet 4.6 extended.
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
### abc-tools - a related repo
Apart from rendering scores and transposition (handled by `abcjs`), all other functionality related to ABC is from my [“abc-tools” repo](https://github.com/goplayerjuggler/abc-tools).

### npm scripts
``` PowerShell
# setup
npm install
# run local version
npm run dev
# build
npm run build

# working with abc-tools: just install it as a sibling - same parent folder 
npm run dev:local # this way abc-tools is from local version, not from npm package

```

### Using other tunes
It should be fairly easy to adapt this to other tune lists. One way would be: clone this repo and replace its tune data with your own tune data. For this I would advise starting inside the tool by loading tunes in ABC format, and exporting the data in Javascript format. Then in VS Code, run a script (`split-tunes.mjs`) to get the `.data.js` files. I may write a more detailed guide for this at some point.
