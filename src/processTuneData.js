import {
	getContour,
	getIncipit,
	getIncipitForContourGeneration,
	normaliseKey,
	getKey,
	getHeaders,
	getTunes,
	sortConstants
} from "@goplayerjuggler/abc-tools";
import { abcXs } from "./entityReferences.mjs";

const swingTransformRhythms =
	sortConstants.DEFAULT_CONTOUR_OPTIONS.swingTransformRhythms;
const swingTransform3_4_rhythms =
	sortConstants.DEFAULT_CONTOUR_OPTIONS.swingTransform3_4_rhythms;

/**
 * A tune's references as one ordered list, the order that cross-reference
 * `index` values (see cross-references.md) refer to:
 *   1. `referencesFromAbc`        — derived from the tune's ABC by processTuneData
 *   2. `references`               — entered by hand
 *   3. `referencesFromEntities`   — linked at build time to the reference entities
 *                                   that mention the tune (`{ referenceId, indices }`),
 *                                   and expanded into the shape formatReference
 *                                   renders on loading a list
 *                                   (hydrateReferencesFromEntities, entityReferences.mjs)
 * Later sources are appended, so adding one never shifts earlier indices
 * (but see `abcX`, below).
 *
 * A reference entity may point to one setting of the tune, by the `X:` header of an
 * item of `tune.abc` (`abcX`). The ABC-derived reference of that setting is then
 * merged into the entity's: the entity supplies the url, album and artists (the ABC's
 * F:, D: and S: are ignored), and the ABC's N: and H: comments are added to its notes.
 * The merged reference is part 3, and the ABC-derived one leaves part 1.
 * Nothing is mutated: the merge is redone on each call, so it survives reprocessTune.
 *
 * With `abcIndex`, only that setting's ABC-derived reference (the one solo mode of the
 * ABC modal shows) is considered, so only that setting's comments are merged.
 */
function getCombinedReferences(tune, abcIndex) {
	const fromAbc = (tune.referencesFromAbc ?? []).filter(
		(ref) => abcIndex === undefined || ref._abcIndex === abcIndex
	);
	const merged = new Set(); // the ABC-derived references that went into an entity's
	const fromEntities = (tune.referencesFromEntities ?? []).map((ref) => {
		const abcRefs = fromAbc.filter((abcRef) =>
			ref.abcX?.includes(abcRef._abcX)
		);
		abcRefs.forEach((abcRef) => merged.add(abcRef));
		return abcRefs.length
			? {
					...ref,
					notes: [ref.notes, ...abcRefs.map((abcRef) => abcRef._abcNotes)]
						.filter(Boolean)
						.join("\n")
				}
			: ref;
	});
	return fromAbc
		.filter((abcRef) => !merged.has(abcRef))
		.concat(tune.references ?? [], fromEntities);
}

function updateFromMetadata(
	metaData,
	processed,
	setIsFromAbc = true,
	updateBasicInfo = true,
	abcIndex,
	abcX
) {
	if (updateBasicInfo) {
		if (!processed.name && metaData.title) {
			processed.name = metaData.title;
			if (setIsFromAbc) processed.nameIsFromAbc = true;
		}

		// if (!processed.rhythm && metaData.rhythm) {
		// 	processed.rhythm = metaData.rhythm;
		// 	if (setIsFromAbc) processed.rhythmIsFromAbc = true;
		// }
		["key", "rhythm", "meter", "composer", "origin", "titles"].forEach(
			(prop) => {
				if (!processed[prop] && metaData[prop]) {
					processed[prop] = metaData[prop];
					if (setIsFromAbc) processed[prop + "IsFromAbc"] = true;
				}
			}
		);
	}

	if (!processed.references) {
		processed.references = [];
	}

	if (
		metaData.source ||
		metaData.url ||
		metaData.recording ||
		metaData.comments ||
		metaData.hComments
	) {
		// The N: and H: comments, also kept apart (`_abcNotes`): they are all that gets
		// merged into a reference entity that points to this setting (see getCombinedReferences).
		const comments =
			(metaData.comments ? metaData.comments.join("\n") + "\n" : "") +
			(metaData.hComments ? metaData.hComments : "");
		const abcRef = {
			artists: metaData.source || "",
			url: metaData.url || "",
			notes: `${metaData.recording ? `recording/album: ${metaData.recording}\n` : ""}${comments}`,
			_abcNotes: comments.trim()
		};
		if (abcIndex !== undefined) abcRef._abcIndex = abcIndex;
		if (abcX !== undefined) abcRef._abcX = abcX;
		//if (abcRef.notes) abcRef.notes += " (notes extracted from ABC)";

		processed.referencesFromAbc.push(abcRef);
	}
}

function processTuneData(tune) {
	const processed = { referencesFromAbc: [], ...tune };
	try {
		if (!processed.scores) processed.scores = [];
		if (typeof tune.aka === "string") processed.aka = [tune.aka];
		if (typeof tune.badges === "string") processed.badges = [tune.badges];
		if (tune.incipit && !processed.abc) {
			const abcMeta = getHeaders(tune.incipit);
			updateFromMetadata(abcMeta, processed, false);
			processed.incipit =
				//  getFirstBars(tune.incipit, 4, true, false, {
				// 	all: true
				// });
				getIncipit(tune.incipit);
		} else if (tune.abc) {
			if (typeof tune.abc === "string") {
				const firstX = tune.abc.indexOf("X:");

				if (firstX !== -1 && tune.abc.indexOf("X:", firstX + 2) !== -1)
					processed.abc = getTunes(tune.abc);
			}
			const abcArray = Array.isArray(processed.abc)
				? processed.abc
				: [processed.abc];

			abcArray.forEach((abcString, index) => {
				const abcMeta = getHeaders(abcString);
				const [abcX] = abcXs(abcString);

				if (index === 0)
					updateFromMetadata(abcMeta, processed, true, true, index, abcX);
				else updateFromMetadata(abcMeta, processed, false, false, index, abcX);
			});

			if (!tune.incipit) {
				processed.incipit = getIncipit({ abc: abcArray[0] });
				processed.incipitIsFromAbc = true;
			}
			if (!tune.contour) {
				const withSwingTransform =
					swingTransformRhythms.includes(processed.rhythm) ||
					(processed.meter === "3/4" &&
						swingTransform3_4_rhythms.includes(processed.rhythm));
				let shortAbc;
				if (processed.incipit)
					shortAbc = getIncipitForContourGeneration(processed.incipit);
				if (!shortAbc && abcArray && abcArray[0])
					shortAbc = getIncipitForContourGeneration(abcArray[0]);

				if (shortAbc) {
					processed.contour = getContour(shortAbc, {
						contourShift: processed.contourShift,
						withSwingTransform
					});
					if (processed.contour) processed.contour.svg = null;
				}
			}
			processed.rhythm = processed.rhythm?.toLowerCase();
		} else if (tune.incipit && !processed.key) {
			processed.key = normaliseKey(getKey(tune.incipit)).join(" ");
		}
		if (!processed.name) processed.name = "Untitled";
		if (!processed.key) processed.key = "";
		if (!processed.rhythm) processed.rhythm = "";
		else processed.rhythm = processed.rhythm.toLowerCase();
		if (!processed.references) processed.references = [];

		processed.combinedReferences = getCombinedReferences(processed);
	} catch (error) {
		console.log(
			`error processing tune: ${processed.title ?? processed.abc ?? processed.incipit}. Error: ${error}`
		);
	}
	return processed;
}

function reprocessTune(tune, options = {}) {
	const { removeContour = true } = options;

	// Reprocess tune data (`referencesFromEntities` is build-derived, so it is kept)
	let reprocessed = Object.assign({}, tune);
	delete reprocessed.name;
	delete reprocessed.nameIsFromAbc;
	delete reprocessed.key;
	delete reprocessed.keyIsFromAbc;
	delete reprocessed.rhythm;
	delete reprocessed.rhythmIsFromAbc;
	if (reprocessed.incipitIsFromAbc) {
		delete reprocessed.incipit;
		delete reprocessed.incipitIsFromAbc;
	}
	delete reprocessed.incipitSvg;
	delete reprocessed.referencesFromAbc;

	if (removeContour) {
		delete reprocessed.contour;
	}

	return processTuneData(reprocessed);
}

function getIncipitWithSelector(tune, selector = {}) {
	const { theSessionSettingId, x } = selector;

	if (
		(x || theSessionSettingId) &&
		Array.isArray(tune.abc) &&
		tune.abc.length > 1
	) {
		const regExForXHeader = x
			? new RegExp(String.raw`(?:^|\n)X:\s?${x}\n`)
			: null;
		const settingUrl = x
			? null
			: `https://thesession.org/tunes/${tune.theSessionId}#setting${theSessionSettingId}`;
		const matchingAbc = tune.abc.find((abc) =>
			x ? regExForXHeader.test(abc) : abc.includes(settingUrl)
		);
		if (matchingAbc) {
			return getIncipit({ abc: matchingAbc });
		}
	}
	return tune?.incipit;
}

export {
	processTuneData,
	swingTransformRhythms as applySwingTransform,
	reprocessTune,
	getIncipitWithSelector,
	getCombinedReferences
};
