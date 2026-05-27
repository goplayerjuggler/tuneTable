# Tune table

## TL;DR
Why read this? Don’t – read the intro instead!  

Instead of reading this, go and open the thing: [goplayerjuggler.github.io/tuneTable](https://goplayerjuggler.github.io/tuneTable/). There’s a non-technical intro screen that displays automatically the first time, which may well be an easier/better read than this document. There is some overlap between the two documents. The intro can be opened again afterwards by clicking on a label (**__about “Tune table”__**) in the footer, and in the Edit menu.

The HTML code for the intro is [here](./src/modules/modals/IntroModal.html).

## Overview
“Tune table” is a single-page application for exploring and managing tune collections. It displays tunes using standard music notation. Notable features include transposition buttons; set lists (tunes arranged into sets) with Print to PDF; import from [thesession.org](https://thesession.org), and more.

In my opinion the most notable/original feature is how it _sorts_ tunes. It’s based on something I call the _contour_ of a tune: the melodic shape relative to the tonic, abstracted away from key and mode. Contours are shown graphically; they’re derived automatically from an incipit (a short score giving the first few notes of the tune). Contours are similar to [graphical scores](https://en.wikipedia.org/wiki/Graphic_notation_(music)) but I don’t think they completely fit the definition of the term.

The tool is “standalone”: it can load data but it never sends any data back in the other direction.

Scores (sheet music) are written in [ABC format](https://abcnotation.com/wiki/abc:standard:v2.1) which then goes inside (plain) JavaScript objects. 

This project is in the alpha stage of development. 

## Who this is for
I built this for myself and the musicians I play with, to explore, organise and share repertoire I’m interested in. I also wanted to experiment with things like contour sorting. I believe it will also be of interest to other musicians.

## Features
* sort tunes based on the tune’s _contour_ w.r.t. to the tonic:
  * key and mode agnostic; also to some extent octave agnostic – more details [here](https://github.com/goplayerjuggler/abc-tools/blob/main/docs/contour_sort.md).
  * contours are displayed next to the tune’s title
  * cycle through different types of multi-level sorting involving “contour” sorting, by successive clicks on the header of the first column in the main table.
* incipits are shown next to tune titles. They are extracted from a full score; optionally they can instead be given explicitly as part of the tune data.
* a popup score viewer with transpose buttons, for tunes with one or more settings in ABC. Longer scores are paginated.
* tunes may have additional information such as comments/notes; tags; and external links to recordings, websites like thesession.org, and other online resources.
* search/filtering by full text / key / rhythm, and also by other types of metadata (such as region of origin, composer, custom tags, …) via clicks on the “badges” next to the tune titles.
* import & export functions
  * lists of tunes in ABC format can be imported
  * tune lists can be exported/imported using a custom JavaScript format
  * copy data for one single tune, or one single set list
  * integration with thesession.org: load a member’s tune book or one specific tune; load a member’s sets
* a set list creation and management feature that allows users to select tunes from the main table and arrange them into ordered sets for sessions, or gigs, or classes, or other events. With some customisable Print functionality too. 
* bar length switcher: toggle between standard bar lengths, and bars that are twice as long, which I often prefer. For the moment this feature is limited to reels, jigs, polkas, hornpipes, and barndances. For reels, it also converts quavers to semiquavers.
* persistence: all changes to the tune list are automaticaly saved locally, in memory areas that are allocated to your browser. So you can close the browser, or reboot, and still see your most recent list the next time you load the page on your device with the same browser. Changes to set lists are not automaticallty saved, but can be by clicking on a Save button. A warning however: this data will be lost if you clear your browser data, switch browsers or devices, or if the browser happens to free up space for some reason or other. So if you use local lists, do **make backups**.
* any and all changes made to tunes and tune lists work on a local version; no data is sent elsewhere.
* tune list management: users can switch between lists of tunes hosted online, including open-source collections compiled by other people, and their own local lists of tunes.
* lazy loading of SVGs for incipits and contours in order avoid excessive memory usage when viewing a list with thousands of tunes.
* tunes can be partially edited within the tool inside a basic editor, but I hardly use this and don’t really feel like doing much more with this feature.

### Query parameters `n` (name), `q` (query), `s` (set), `l` (list) and `g` (group)
* You can open a specific tune directly by specifying part of its name, eg: 
[goplayerjuggler.github.io/tuneTable/?n=cameronian](https://goplayerjuggler.github.io/tuneTable/?n=cameronian) 
* query everything that matches a full-text search with `q` in the URL:
[goplayerjuggler.github.io/tuneTable/?q=crooked](https://goplayerjuggler.github.io/tuneTable/?q=crooked)
* the `g` parameter selects a “server list” that was prepared based on the `tune.groups` property. Example:  
[goplayerjuggler.github.io/tuneTable/?g=alora](https://goplayerjuggler.github.io/tuneTable/?g=alora) opens the “ALORA” list.
* the `l` parameter selects any “server list”. Example: 
[goplayerjuggler.github.io/tuneTable/?l=default](https://goplayerjuggler.github.io/tuneTable/?l=default) opens the default list.
* Parameters can be combined. Example: 
[load Darby the driver from the default list](https://goplayerjuggler.github.io/tuneTable/?l=default&n=darby+the+driver) 
* the `s` parameter selects a set. Example: 
[goplayerjuggler.github.io/tuneTable/?l=default&s=Boys Of Ballisodare set – 3 hop jigs](https://goplayerjuggler.github.io/tuneTable/?l=default&s=Boys%20Of%20Ballisodare%20set%20-%203%20hop%20jigs)

## Current list of tunes
It’s a hodgepodge list of tunes I either like, am interested in, or want to share with some musicians, or … 
A fair number of the scores there are my own work, either transcriptions of other people’s tunes or original pieces. I reserve some rights on this via a CC licence; details below.

I try to provide at least one setting or incipit for each tune.

Most (but not all) of the tune settings were imported from [thesession.org](https://thesession.org) based on [my tune book there](https://thesession.org/members/40345/tunebook). I tweaked many of these imported tunes afterwards. However I haven’t yet gone systematically through all the tunes to check important things like the key – for contour sorting, it makes a big difference, e.g. having `K:G` instead of `K: Dmix`! But I believe the key is mostly correct. In general if a reel is still in 4/4 with quavers, then I haven’t yet gotten round to reviewing it since it was imported.

## Upcoming features / wishlist
Here are some features I would like to have:
* improve the score viewer: adapt the score layout depending on user input and available screen space; print functionality (maybe add outbound links to Michael Eskin's abcTools which already has such functionality)
* a user preferences UI: settings for sorting and displaying tunes, importing data, and PDF output.
* provide several incipits for a single tune – indexing by B, C parts etc.
* parsing of ABC to determine the structure of a tune – i.e. is it made up of parts ABCDE, or AABB, or something else.
* a feature to format ABC code (this would go in the `abcTools` repo; but would be handy here, e.g. to improve the beaming in the end result when a reel is switched to 4/4 with semiquavers).
* rename the whole thing – I started this project in September 2025 and it now seems that “tune _library_” would be a better name.

## A previous project from ~2005
Around 2005, I made another [table of tunes](http://malcolm.schonfield.free.fr/zik.php), to publish some music scores I had written. It has a similar approach to this project, and it has some music content I mean to copy over to this repo at some point. So this project is a second attempt along the same lines.

## Thanks
Thanks to: 
* Paul Rosen and Gregory Dyke for their fantastic library [abcjs](https://github.com/paulrosen/abcjs). These days it’s behind most of the online resources related to music written in ABC format.
* Michael Eskin for his amazing online ABC editor, [ABC tools](https://michaeleskin.com/app/abctools.html), which I’ve found very handy over the years. Michael has already kindly given me a several tips about handling ABC. The code for the incipit generator – now in my abc-tools repo – is a fork of his code.
* Jeremy from [thesession.org](https://thesession.org) for providing such a great resource and helping me with a question about it. Thesession was an inspiration for quite a few features here.
* Anton Bregolas, whose [TuneTable](https://anton-bregolas.github.io/Tunetable/) inspired me to set up “import from thesession.org”. More recently, I see he’s published other projects such as the [Novi Sad Session Setlist App](https://ns.tunebook.app/) – a very well done app, with some parallels with this project.
* Gilles Raymond for requesting the set list & print feature.
* Treasa Harkin, at [itma.ie](https://itma.ie), for reviewing an earlier version and for suggesting two features which have since been made: the intro page and the “badge filtering”. 
* Anthropic: roughly 90% of the code (in this repo and in my other related repo, [abc-tools](#abc-tools---a-related-repo)) was written by Claude.ai / Sonnet 4.6 extended.
* Github for hosting this whole thing

## Licences

This project uses multiple licences depending on the type of content:

- **Code (JavaScript, HTML, CSS)**: [MIT Licence](LICENSE-CODE)
- **Tune list data (.data.js files)**: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](LICENSE-DATA)
- **ABC tune files (`tunes/` folder)**: from external sources – licencing terms are embedded within each individual file or are available from the linked websites

### What this means:

**Code**: Can be freely used, modified, and distributed (see [MIT Licence terms](LICENSE-CODE))

**Tune list data**: Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), which means:
- **BY** (Attribution): You must give appropriate credit to the original creator
- **NC** (NonCommercial): You may not use the data for commercial purposes
- **SA** (ShareAlike): If you remix or build upon the data, you must distribute your contributions under the same CC BY-NC-SA 4.0 license

**ABC tune files**: These files are from external sources. Each file should contain its own licensing information, or give a reference to a website with this info – please refer to the individual file before reusing or redistributing it.

## Dev notes
### abc-tools – a related repo
Apart from rendering scores and transposition (handled by `abcjs`), all other functionality related to ABC is from my [“abc-tools” repo](https://github.com/goplayerjuggler/abc-tools).

### npm scripts
``` PowerShell
# setup
npm install

# run local version
npm run dev

# build tune lists
node .\build\build-tune-lists.mjs 

# build website
npm run build # this includes the tune lists

# working with abc-tools: just install it as a sibling – same parent folder 
npm run dev:local # this way abc-tools is from local version, not from the npm package
```

### Using other tune collections – as a developer
(Just an outline of how I think it could work.)

First clone the repo. 
* ABC files: add your own ABC files under `.\src\tunes\`; just add some header lines `%% list-name` etc – use an abc file in the folder as a model.
* working with `.data.js` files: probably just start inside the tool by loading tunes in ABC format, and exporting the data in JavaScript format. Then in VS Code or elsewhere, run a script (`.\dev\split-tunes.mjs`) to get the `.data.js` files. 

### my local import settings
I currently use the following settings. 

(Please don’t infer anything special from the list of accounts. They’re just people whose settings I found at some point to be well-done. I had to put them in an order, but it’s fairly arbitrary.)

```JavaScript
//open the project locally, then in Dev Tools run this:
localStorage.setItem('theSessionImportConfig', JSON.stringify({
	withComments: true,
	skipLevel: "ifTuneExists",
	doubleBarLengthWherePossible: true,
	importAllSettingsForSpecifiedUser: true,
	settingChoiceCriteria: [
		{
			preferredUserIds: [
				[40345, "GoPlayerJuggler"],
				[11705, "ceolachan"],
				[4763, "Dr. Dow"],
				[5628, "hnorbeck"],
				[13094, "birlibirdie"],
				[11834, "Nigel Gatherer"],
				[1, "Jeremy"],
				[6451, "jackb"],
				[116353, "John E Roche"],
				[3150, "slainte"],
				[60897, "Fernando Durbán Galnares"],
				[119445, "piperDave"],
				[8648, "erik-fiddler"]
			]
		},
		"withChords",
		"preferShorter"
	]
}))

```

### Contributing
Issues and pull requests are welcome.