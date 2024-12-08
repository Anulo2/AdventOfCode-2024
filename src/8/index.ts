export function part1(input: string): number {
	const { frequencies, lines } = parseInput(input);
	const antinodes = calculateAntinodes(frequencies, lines, false);
	//printMapWithAntinodes(frequencies, lines, antinodes);
	return antinodes.size;
}

export function part2(input: string): number {
	const { frequencies, lines } = parseInput(input);
	const antinodes = calculateAntinodes(frequencies, lines, true);
	//printMapWithAntinodes(frequencies, lines, antinodes);
	return antinodes.size;
}

function printMapWithAntinodes(
	frequencies: { [key: string]: [number, number][] },
	lines: string[],
	antinodes: Set<string>,
): void {
	const map = lines.map((line) => line.split(""));
	for (const [char, value] of Object.entries(frequencies)) {
		for (const [x, y] of value) {
			map[y][x] = char;
		}
	}
	for (const antinode of antinodes) {
		const [x, y] = antinode.split(",").map(Number);
		map[y][x] = "#";
	}
	console.log(map.map((line) => line.join("")).join("\n"));
}

function parseInput(input: string): {
	frequencies: { [key: string]: [number, number][] };
	lines: string[];
} {
	const frequencies: { [key: string]: [number, number][] } = {};
	const lines = input.trim().split("\r\n");

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

	return { frequencies, lines };
}

function calculateAntinodes(
	frequencies: { [key: string]: [number, number][] },
	lines: string[],
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
				if (antinodesWithinBounds(antinode1X, antinode1Y, lines)) {
					antinodes.add(`${antinode1X},${antinode1Y}`);
				}

				const antinode2X = x2 + dx;
				const antinode2Y = y2 + dy;
				if (antinodesWithinBounds(antinode2X, antinode2Y, lines)) {
					antinodes.add(`${antinode2X},${antinode2Y}`);
				}

				if (includeIntermediate) {
					for (let k = 0; k < 100; k++) {
						const antinodeX1 = x1 + k * dx;
						const antinodeY1 = y1 + k * dy;
						if (antinodesWithinBounds(antinodeX1, antinodeY1, lines)) {
							antinodes.add(`${antinodeX1},${antinodeY1}`);
						}

						const antinodeX2 = x1 - k * dx;
						const antinodeY2 = y1 - k * dy;
						if (antinodesWithinBounds(antinodeX2, antinodeY2, lines)) {
							antinodes.add(`${antinodeX2},${antinodeY2}`);
						}
					}
				}
			}
		}
	}

	return antinodes;
}

function antinodesWithinBounds(x: number, y: number, lines: string[]): boolean {
	return x >= 0 && x < lines[0].length && y >= 0 && y < lines.length;
}
