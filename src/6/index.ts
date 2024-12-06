const directionsMap: Record<string, [number, number]> = {
	"^": [0, -1],
	">": [1, 0],
	v: [0, 1],
	"<": [-1, 0],
};

function nextStep(
	map: string[][],
	[x, y]: [number, number],
	dir: string,
): [number, number] {
	const [dx, dy] = directionsMap[dir];
	return [x + dx, y + dy];
}

function rotateDirection(dir: string): string {
	return { "^": ">", ">": "v", v: "<", "<": "^" }[dir] ?? "^";
}

function findStartingPos(
	map: string[][],
	directions: string[],
): [number, number, string] {
	return map.reduce<[number, number, string]>(
		(acc, row, y) =>
			directions.reduce<[number, number, string]>((innerAcc, dir) => {
				const x = row.indexOf(dir);
				return x !== -1 ? [x, y, dir] : innerAcc;
			}, acc),
		[0, 0, " "],
	);
}

function traverseMap(
	map: string[][],
	startPos: [number, number, string],
): number {
	let pos = startPos;
	let steps = 0;

	while (pos[2] !== " ") {
		const [x, y, dir] = pos;
		const [nextX, nextY] = nextStep(map, [x, y], dir);

		if (
			nextX < 0 ||
			nextX >= map[0].length ||
			nextY < 0 ||
			nextY >= map.length
		) {
			break;
		}

		if (map[nextY]?.[nextX] === "#") {
			const newDir = rotateDirection(dir);
			map[y][x] = newDir;
			pos = [x, y, newDir];
		} else {
			map[y][x] = "X";
			pos = [nextX, nextY, dir];
		}

		steps++;
	}

	return map.flat().filter((cell) => cell === "X").length + 1;
}

export function part1(input: string): number {
	const map = input
		.trim()
		.split("\n")
		.map((line) => line.split(""));
	const directions = ["^", ">", "v", "<"];
	const startPos = findStartingPos(map, directions);
	return traverseMap(map, startPos);
}

export function part2(input: string): number {
	const map = input
		.trim()
		.split("\n")
		.map((line) => line.split(""));
	const directions = ["^", ">", "v", "<"];
	const [startX, startY, startDir] = findStartingPos(map, directions);

	const loopCount = map.reduce((count, row, y) => {
		return (
			count +
			row.reduce((innerCount, cell, x) => {
				if (cell === "." && !(x === startX && y === startY)) {
					const testMap = map.map((row) => row.slice());
					testMap[y][x] = "#";

					let pos: [number, number, string] = [startX, startY, startDir];
					const visited = new Set<string>();
					let isLoop = false;

					while (true) {
						const [curX, curY, dir] = pos;
						const [nextX, nextY] = nextStep(testMap, [curX, curY], dir);

						if (
							nextX < 0 ||
							nextX >= testMap[0].length ||
							nextY < 0 ||
							nextY >= testMap.length
						) {
							break;
						}

						if (testMap[nextY]?.[nextX] === "#") {
							const newDir = rotateDirection(dir);
							pos = [curX, curY, newDir];
						} else {
							pos = [nextX, nextY, dir];
						}

						const posKey = `${pos[0]},${pos[1]},${pos[2]}`;
						if (visited.has(posKey)) {
							isLoop = true;
							break;
						}
						visited.add(posKey);
					}

					return innerCount + (isLoop ? 1 : 0);
				}
				return innerCount;
			}, 0)
		);
	}, 0);

	return loopCount;
}
