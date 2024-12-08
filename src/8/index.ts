export function part1(input: string): number {
	const { frequencies, rows, cols } = parseInput(input);
	const antinodes = calculateAntinodes(frequencies, rows, cols, false);
	//printMapWithAntinodes(frequencies, lines, antinodes);
	return antinodes.size;
}

export function part2(input: string): number {
	const { frequencies, rows, cols } = parseInput(input);
	const antinodes = calculateAntinodes(frequencies, rows, cols, true);
	//printMapWithAntinodes(frequencies, lines, antinodes);
	return antinodes.size;
}

function parseInput(input: string): {
	frequencies: { [key: string]: [number, number][] };
	rows: number;
	cols: number;
} {
	const frequencies: { [key: string]: [number, number][] } = {};
	const lines = input.trim().split("\r\n");
	const rows = lines.length;
	const cols = lines[0].length;

	lines.forEach((line, y) => {
		line.split("").forEach((char, x) => {
			if (char !== ".") {
				if (!frequencies[char]) {
					frequencies[char] = [];
				}
				frequencies[char].push([x, y]);
			}
		});
	});

	return { frequencies, rows, cols };
}

function calculateAntinodes(
	frequencies: { [key: string]: [number, number][] },
	rows: number,
	cols: number,
	includeIntermediate: boolean,
): Set<string> {
	const antinodes = new Set<string>();

	for (const value of Object.values(frequencies)) {
		for (let i = 0; i < value.length; i++) {
			const [x1, y1] = value[i];
			for (let j = i + 1; j < value.length; j++) {
				const [x2, y2] = value[j];
				const dx = x2 - x1;
				const dy = y2 - y1;

				const antinode1X = x1 - dx;
				const antinode1Y = y1 - dy;
				if (antinodesWithinBounds(antinode1X, antinode1Y, rows, cols)) {
					antinodes.add(`${antinode1X},${antinode1Y}`);
				}

				const antinode2X = x2 + dx;
				const antinode2Y = y2 + dy;
				if (antinodesWithinBounds(antinode2X, antinode2Y, rows, cols)) {
					antinodes.add(`${antinode2X},${antinode2Y}`);
				}

				if (includeIntermediate) {
					let outOfBounds1 = false;
					let outOfBounds2 = false;

					let k = 0;
					while (!outOfBounds1 || !outOfBounds2) {
						const antinodeX1 = x1 + k * dx;
						const antinodeY1 = y1 + k * dy;
						if (antinodesWithinBounds(antinodeX1, antinodeY1, rows, cols)) {
							antinodes.add(`${antinodeX1},${antinodeY1}`);
						} else {
							outOfBounds1 = true;
						}

						const antinodeX2 = x1 - k * dx;
						const antinodeY2 = y1 - k * dy;
						if (antinodesWithinBounds(antinodeX2, antinodeY2, rows, cols)) {
							antinodes.add(`${antinodeX2},${antinodeY2}`);
						} else {
							outOfBounds2 = true;
						}

						k++;
					}
				}
			}
		}
	}

	return antinodes;
}

function antinodesWithinBounds(
	x: number,
	y: number,
	rows: number,
	cols: number,
): boolean {
	return x >= 0 && x < cols && y >= 0 && y < rows;
}
