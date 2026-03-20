import {
	getContour,
	getIncipit,
	getIncipitForContourGeneration,
	normaliseKey,
	getKey,
	getFirstBars,
	getMetadata,
	getTunes
} from "@goplayerjuggler/abc-tools";

const applySwingTransform = ["hornpipe", "barndance", "fling", "mazurka"];

function updateFromMetadata(
	metaData,
	processed,
	setIsFromAbc = true,
	updateBasicInfo = true
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
		const abcRef = {
			artists: metaData.source || "",
			url: metaData.url || "",
			notes: `${metaData.recording ? `recording/album: ${metaData.recording}\n` : ""}${
				(metaData.comments ? metaData.comments.join("\n") + "\n" : "") +
				(metaData.hComments ? metaData.hComments : "")
			}`,
			fromAbc: true
		};
		//if (abcRef.notes) abcRef.notes += " (notes extracted from ABC)";

		processed.processedFromAbc.push(abcRef);
	}
}

function processTuneData(tune) {
	const processed = { processedFromAbc: [], ...tune };
	try {
		if (!processed.scores) processed.scores = [];
		if (typeof tune.aka === "string") processed.aka = [tune.aka];
		if (typeof tune.badges === "string") processed.badges = [tune.badges];
		if (tune.incipit && !processed.abc) {
			const abcMeta = getMetadata(tune.incipit);
			updateFromMetadata(abcMeta, processed, false);
			processed.incipit = getFirstBars(tune.incipit, 4, true, false, {
				all: true
			});
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
				const abcMeta = getMetadata(abcString);

				if (index === 0) updateFromMetadata(abcMeta, processed);
				else updateFromMetadata(abcMeta, processed, false, false);
			});

			if (!tune.incipit) {
				processed.incipit = getIncipit({ abc: abcArray[0] });
			}
			if (!tune.contour) {
				const withSwingTransform =
					applySwingTransform.indexOf(processed.rhythm) >= 0;
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
		processed.references = [
			...processed.processedFromAbc,
			...processed.references
		];
		delete processed.processedFromAbc;
	} catch (error) {
		console.log(
			`error processing tune: ${processed.title ?? processed.abc ?? processed.incipit}. Error: ${error}`
		);
	}
	return processed;
}

export { processTuneData, applySwingTransform };
