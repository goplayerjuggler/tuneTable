import {normaliseKey} from "@goplayerjuggler/abc-tools"

import {getIncipit} from "@goplayerjuggler/abc-tools";
function parseAbc(abc) {
  const lines = abc.split("\n"),
	metadata = {},
	comments = [];

  for (const line of lines) {
	const trimmed = line.trim();
	if (trimmed.startsWith("T:") && !metadata.title) {
	  metadata.title = trimmed.substring(2).trim();
	} else if (trimmed.startsWith("R:")) {
	  metadata.rhythm = trimmed.substring(2).trim();
	} else if (trimmed.startsWith("K:")) {
	  metadata.key = normaliseKey(trimmed.substring(2).trim()).join(' ');
	  break;
	} else if (trimmed.startsWith("S:")) {
	  metadata.source = trimmed.substring(2).trim();
	} else if (trimmed.startsWith("F:")) {
	  metadata.url = trimmed.substring(2).trim();
	} else if (trimmed.startsWith("D:")) {
	  metadata.recording = trimmed.substring(2).trim();
	} else if (trimmed.startsWith("N:")) {
	  comments.push(trimmed.substring(2).trim());
	}
  }
  if (comments.length > 0) {
	metadata.comments = comments;
  }

  return metadata;
}

function processTuneData(tune) {
  const processed = { ...tune };

  if (tune.abc) {
	const abcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];

	abcArray.forEach((abcString, index) => {
	  const abcMeta = parseAbc(abcString);

	  if (index === 0) {
		if (!processed.name && abcMeta.title) {
		  processed.name = abcMeta.title;
		  processed.nameIsFromAbc = true
		}
		if (!processed.rhythm && abcMeta.rhythm) {
		  processed.rhythm = abcMeta.rhythm;
		  processed.rhythmIsFromAbc = true
		}
		if (!processed.key && abcMeta.key) {
		  processed.key = abcMeta.key;
		  processed.keyIsFromAbc = true;
		}
	  }

	  if (!processed.references) {
		processed.references = [];
	  }

	  if (
		abcMeta.source ||
		abcMeta.url ||
		abcMeta.recording ||
		abcMeta.comments
	  ) {
		const abcRef = {
		  artists: abcMeta.source || "",
		  url: abcMeta.url || "",
		  notes:
			(abcMeta.recording || "") +
			`${abcMeta.recording ? "\n" : ""}${
			  abcMeta.comments ? abcMeta.comments.join("\n") : ""
			}`,
			fromAbc:true
		};

		processed.references.push(abcRef);
	  }
	});
	if (!tune.incipit) {
	  processed.incipit = getIncipit({abc:abcArray[0]});
	}
	processed.rhythm = processed.rhythm?.toLowerCase();
  }

  if (!processed.name) processed.name = "Untitled";
  if (!processed.key) processed.key = "";
  if (!processed.rhythm) processed.rhythm = "";
  if (!processed.references) processed.references = [];
  if (!processed.scores) processed.scores = [];
  return processed;
}

export default processTuneData