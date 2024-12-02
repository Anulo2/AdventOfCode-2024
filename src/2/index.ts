export function part1(input: string): number {
	return input
		.trim()
		.split("\n")
		.map((line) => line.trim().split(/\s+/).map(Number))
		.filter((levels) => {
			const diffs = levels.slice(1).map((n, i) => n - levels[i]);
			const validDiffs = diffs.every((d) => Math.abs(d) >= 1 && Math.abs(d) <= 3);
			const increasing = diffs.every((d) => d > 0);
			const decreasing = diffs.every((d) => d < 0);
			return validDiffs && (increasing || decreasing);
		}).length;
}

export function part2(input: string): number {
	return input
		.trim()
		.split("\n")
		.map((line) => line.trim().split(/\s+/).map(Number))
		.filter((levels) => {
			const diffs = levels.slice(1).map((n, i) => n - levels[i]);
			const isGood = () => {
				const validDiffs = diffs.every((d) => Math.abs(d) >= 1 && Math.abs(d) <= 3);
				const increasing = diffs.every((d) => d > 0);
				const decreasing = diffs.every((d) => d < 0);
				return validDiffs && (increasing || decreasing);
			};

			const canBeMadeGood = () => {
				return levels.some((_, i) => {
					const newLevels = levels.slice(0, i).concat(levels.slice(i + 1));
					const newDiffs = newLevels.slice(1).map((n, j) => n - newLevels[j]);
					const validDiffs = newDiffs.every((d) => Math.abs(d) >= 1 && Math.abs(d) <= 3);
					const increasing = newDiffs.every((d) => d > 0);
					const decreasing = newDiffs.every((d) => d < 0);
					return validDiffs && (increasing || decreasing);
				});
			};

			return isGood() || canBeMadeGood();
		}).length;
}