export function part1(input: string): number {
	const [listA, listB] = input
		.trim()
		.split("\n")
		.map((line) => line.trim().split(/\s+/).map(Number))
		.reduce(
			(acc, [a, b]) => {
				acc[0].push(a);
				acc[1].push(b);
				return acc;
			},
			[[], []] as [number[], number[]],
		)
		.map((list) => list.sort((x, y) => x - y));

	return listA.reduce((sum, a, index) => sum + Math.abs(a - listB[index]), 0);
}

export function part2(input: string): number {
	const [listA, listB] = input
		.trim()
		.split("\n")
		.map((line) => line.trim().split(/\s+/).map(Number))
		.reduce(
			(acc, [a, b]) => {
				acc[0].push(a);
				acc[1].push(b);
				return acc;
			},
			[[], []] as [number[], number[]],
		);

	// Create a frequency map for listB
	const freqMap = new Map<number, number>();
	for (const b of listB) {
		freqMap.set(b, (freqMap.get(b) || 0) + 1);
	}

	// Calculate similarity score
	return listA.reduce((score, a) => score + a * (freqMap.get(a) || 0), 0);
}
