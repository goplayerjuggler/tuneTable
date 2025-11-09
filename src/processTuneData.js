import {
	getContour,
	getIncipit,
	getIncipitForContourGeneration,
	normaliseKey,
	getKey,
	getFirstBars,
} from "@goplayerjuggler/abc-tools";

const applySwingTransform = ["hornpipe", "barndance", "fling", "mazurka"];

function getMetadata(abc) {
	const lines = abc.split("\n"),
		metadata = {},
		comments = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith("T:") && !metadata.title) {
			metadata.title = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("R:")) {
			metadata.rhythm = trimmed.substring(2).trim().toLowerCase();
		} else if (trimmed.startsWith("C:")) {
			metadata.composer = trimmed.substring(2).trim().toLowerCase();
		} else if (trimmed.startsWith("M:")) {
			metadata.meter = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("K:")) {
			metadata.key = normaliseKey(trimmed.substring(2).trim()).join(" ");
			// metadata.indexOfKey = i
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

function updateFromMetadata(metaData, processed, setIsFromAbc = true) {
	if (!processed.name && metaData.title) {
		processed.name = metaData.title;
		if (setIsFromAbc) processed.nameIsFromAbc = true;
	}
	if (!processed.rhythm && metaData.rhythm) {
		processed.rhythm = metaData.rhythm;
		if (setIsFromAbc) processed.rhythmIsFromAbc = true;
	}
	if (!processed.meter && metaData.meter) {
		processed.meter = metaData.meter;
		if (setIsFromAbc) processed.meterIsFromAbc = true;
	}
	if (!processed.key && metaData.key) {
		processed.key = metaData.key;
		if (setIsFromAbc) processed.keyIsFromAbc = true;
	}
}

function processTuneData(tune) {
	const processed = { ...tune };

	if (tune.incipit && !tune.abc) {
		const abcMeta = getMetadata(tune.incipit);
		updateFromMetadata(abcMeta, processed, false);
		processed.incipit = getFirstBars(tune.incipit, 4, true, false, {
			all: true,
		});
	} else if (tune.abc) {
		const abcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];

		abcArray.forEach((abcString, index) => {
			const abcMeta = getMetadata(abcString);

			if (index === 0) updateFromMetadata(abcMeta, processed);

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
					fromAbc: true,
				};

				processed.references.push(abcRef);
			}
		});
		if (!tune.incipit) {
			try {
				processed.incipit = getIncipit({ abc: abcArray[0] });
			} catch (error) {
				console.log(error);
			}
		}
		if (!tune.contour) {
			try {
				const withSwingTransform =
					applySwingTransform.indexOf(processed.rhythm) >= 0;
				let shortAbc;
				if (processed.incipit)
					shortAbc = getIncipitForContourGeneration(processed.incipit);
				if (!shortAbc && abcArray && abcArray[0])
					shortAbc = getIncipitForContourGeneration(abcArray[0]);

				if (shortAbc) {
					processed.contour = getContour(shortAbc, {
						withSvg: true,
						withSwingTransform,
					});
				}
				// tune.contour = getContourFromFullAbc(tune.abc || tune.incipit, {
				// 	withSwingTransform,
				// });
				// );
			} catch (error) {
				console.log(error);
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
	if (!processed.scores) processed.scores = [];
	if (tune.theSessionId && processed.scores.length === 0) {
		const setting = tune.theSessionSettingId
			? `#setting${tune.theSessionSettingId}`
			: "";
		processed.scores.push({
			url: `https://thesession.org/tunes/${tune.theSessionId}${setting}`,
			name: "thesession.org",
		});
		delete tune.theSessionId;
		delete tune.theSessionSettingId;
	}

	return processed;
}

export { processTuneData, applySwingTransform };
