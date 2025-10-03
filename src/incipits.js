///adapted from abctools
"use strict";
const incipitLength = 35
//
// Clean an incipit line
//
function cleanIncipitLine(theTextIncipit) {
  //console.log("Starting incipit:");
  //console.log(theTextIncipit);

  // Strip any embedded voice [V:*]
  let searchRegExp = /\[V:\s*\d+\]/gm;
  theTextIncipit = theTextIncipit.replace(searchRegExp, "");
  //console.log(theTextIncipit);

  // Strip any embedded voice V: *
  //searchRegExp = /V: [^ ]+ /gm
  searchRegExp = /V:\s+\S+\s/gm;
  theTextIncipit = theTextIncipit.replace(searchRegExp, "");
  //console.log(theTextIncipit);

  // Strip any embedded voice V:*
  searchRegExp = /V:[^ ]+ /gm;
  theTextIncipit = theTextIncipit.replace(searchRegExp, "");
  //console.log(theTextIncipit);

  // Sanitize !*! style annotations
  searchRegExp = /![^!\n]*!/gm;
  theTextIncipit = theTextIncipit.replace(searchRegExp, "");
  //console.log(theTextIncipit);

  // Strip out repeat marks
  theTextIncipit = theTextIncipit.replaceAll("|:", "|");
  theTextIncipit = theTextIncipit.replaceAll(":|", "|");

  // strip out 1st 2nd etc time repeats
  searchRegExp = /\[\d(,\d)*/gm;
  theTextIncipit = theTextIncipit.replace(searchRegExp, "");

  //console.log(theTextIncipit);

  // Strip out brackets
//   theTextIncipit = theTextIncipit.replaceAll("[", "");
  //console.log(theTextIncipit);

  // Strip out brackets
//   theTextIncipit = theTextIncipit.replaceAll("]", "");
  //console.log(theTextIncipit);

  // Strip out continuations
  theTextIncipit = theTextIncipit.replaceAll("\\", "");
  
  // Segno
  theTextIncipit = theTextIncipit.replaceAll("S", "");

  //console.log("Final raw incipit :");
  //console.log(theTextIncipit);

  return theTextIncipit;
}

function StripAnnotationsOneForIncipits(theNotes) {
  // Strip out tempo markings
  var searchRegExp = /^Q:.*[\r\n]*/gm;

  // Strip out tempo markings
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out Z: annotation
  searchRegExp = /^Z:.*[\r\n]*/gm;

  // Strip out Z: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out R: annotation
  searchRegExp = /^R:.*[\r\n]*/gm;

  // Strip out R: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out S: annotation
  searchRegExp = /^S:.*[\r\n]*/gm;

  // Strip out S: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out N: annotation
  searchRegExp = /^N:.*[\r\n]*/gm;

  // Strip out N: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out D: annotation
  searchRegExp = /^D:.*[\r\n]*/gm;

  // Strip out D: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out H: annotation
  searchRegExp = /^H:.*[\r\n]*/gm;

  // Strip out H: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out B: annotation
  searchRegExp = /^B:.*[\r\n]*/gm;

  // Strip out B: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out C: annotation
  searchRegExp = /^C:.*[\r\n]*/gm;

  // Strip out C: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out O: annotation
  searchRegExp = /^O:.*[\r\n]*/gm;

  // Strip out O: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out A: annotation
  searchRegExp = /^A:.*[\r\n]*/gm;

  // Strip out A: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out P: annotation
  searchRegExp = /^P:.*[\r\n]*/gm;

  // Strip out P: annotation
  theNotes = theNotes.replace(searchRegExp, "");

  return theNotes;
}

//
// Strip all the text annotations in the ABC
//
function StripTextAnnotationsOne(theNotes) {
  // Strip out text markings
  var searchRegExp = /%%text .*[\r\n]*/gm;

  theNotes = theNotes.replace(searchRegExp, "");

  searchRegExp = /%%text[\r\n]/gm;

  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out %%center annotation
  searchRegExp = /%%center.*[\r\n]*/gm;

  // Strip out %%center annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out %%right annotation
  searchRegExp = /%%right.*[\r\n]*/gm;

  // Strip out %%right annotation
  theNotes = theNotes.replace(searchRegExp, "");

  // Strip out %%begintext / %%endtext blocks
  theNotes = theNotes.replace(/^%%begintext[\s\S]*?^%%endtext.*(\r?\n)?/gm, "");

  return theNotes;
}

//
// Strip all the chords in the ABC
//
function StripChordsOne(theNotes) {
  function match_callback(match) {
    // Don't strip tab annotations, only chords
    if (match.indexOf('"_') == -1 && match.indexOf('"^') == -1) {
      // Try and avoid stripping long text strings that aren't chords
      if (match.length > 9) {
        return match;
      }
      // If there are spaces in the match, also probably not a chord
      else if (match.indexOf(" ") != -1) {
        return match;
      } else {
        return "";
      }
    } else {
      return match;
    }
  }

  // Strip out chord markings and not text annotations
  var searchRegExp = /"[^"]*"/gm;

  const output = theNotes
    .split("\n")
    .map((line) => {
      // If line starts with one of the forbidden prefixes, skip replacement
      if (/^[XTMKLQWZRCAOPNGHBDFSIV]:/.test(line) || /^%/.test(line)) {
        return line;
      } else {
        return line.replace(searchRegExp, match_callback);
      }
    })
    .join("\n");

  // Replace the ABC
  return output;
}

export default (theTune) => {
  var j, k, splitAcc;
  var //theTextIncipits = [],
    theTextIncipit,
    theRawSplits,
    theSplitIncipit,
    nSplits;
  // Strip out annotations
  theTune = StripAnnotationsOneForIncipits(theTune);

  // Strip out atextnnotations
  theTune = StripTextAnnotationsOne(theTune);

  // Strip out chord markings
  theTune = StripChordsOne(theTune);

  // Strip out comments
  theTune = theTune.replace(/"[^"]+"/gm, "");
  // Strip out inline parts
  theTune = theTune.replace(/\[P:\w\]/gm, "");

  // Parse out the first few measures
  let theLines = theTune.split("\n");

  let nLines = theLines.length;

  // Find the key
  let theKey = "";

  // Find the first line of the tune that has measure separators
  for (j = 0; j < nLines; ++j) {
    theKey = theLines[j];

    if (theKey.indexOf("K:") != -1) {
      break;
    }
  }
  // Find the L: parameter
  let theL = "";

  // Find the first line of the tune that has measure separators
  for (j = 0; j < nLines; ++j) {
    theL = theLines[j];

    if (theL.indexOf("L:") != -1) {
      break;
    }
  }
  // Find the M: parameter
  let theM = "";

  // Find the first line of the tune that has measure separators
  for (j = 0; j < nLines; ++j) {
    theM = theLines[j];

    if (theM.indexOf("M:") != -1) {
      break;
    }
  }


  // Find the first line of the tune that has measure separators
  for (k = 0; k < nLines; ++k) {
    theTextIncipit = theLines[k];

    // Skip lines that don't have bar lines
    if (theTextIncipit.indexOf("|") == -1) {
      continue;
    }

    // Clean out the incipit line of any annotations besides notes and bar lines
    theTextIncipit = cleanIncipitLine(theTextIncipit);

    // Split the incipit
    theRawSplits = theTextIncipit.split("|");

    theSplitIncipit = [];

    nSplits = theRawSplits.length;

    // Strip out any blank splits
    for (j = 0; j < nSplits; ++j) {
      if (theRawSplits[j] != "") {
        theSplitIncipit.push(theRawSplits[j]);
      }
    }

    // Use just the first few measures
    nSplits = theSplitIncipit.length;

    splitAcc = "";

    for (j = 0; j < nSplits; ++j) {
      theSplitIncipit[j] = theSplitIncipit[j].trim();

      splitAcc += theSplitIncipit[j];

      if (j != nSplits - 1) {
        splitAcc += " | ";
      }
    }

    theTextIncipit = splitAcc;

    // Strip initial bar line
    if (theTextIncipit.indexOf(" | ") == 0) {
      theTextIncipit = theTextIncipit.substring(3, theTextIncipit.length);
    }
	break
    //theTextIncipits.push(theTextIncipit);
  }
  // Limit the incipit length
    if (theTextIncipit.length > incipitLength) {
      theTextIncipit = theTextIncipit.substring(0, incipitLength);
      theTextIncipit = theTextIncipit.trim();
    } else {
      theTextIncipit = theTextIncipit.trim();
    }
  return `X:1\n${theM}\n${theL}\n${theKey}\n${theTextIncipit}`;
};
