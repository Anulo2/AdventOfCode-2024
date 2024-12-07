export const directionsMap: Record<string, [number, number]> = {
	"^": [0, -1],
	">": [1, 0],
	v: [0, 1],
	"<": [-1, 0],
};

export function nextStep(
	map: string[][],
	[x, y]: [number, number],
	dir: string,
): [number, number] {
	const [dx, dy] = directionsMap[dir];
	return [x + dx, y + dy];
}

export function rotateDirection(dir: string): string {
	return { "^": ">", ">": "v", v: "<", "<": "^" }[dir] ?? "^";
}

export function findStartingPos(
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
export function traverseMap(
	map: string[][],
	startPos: [number, number, string],
): number {
	let pos = startPos;
	let steps = 0;
	const visited = new Set<string>();

	while (pos[2] !== " ") {
		const [x, y, dir] = pos;
		const [nextX, nextY] = nextStep(map, [x, y], dir);
		const currentPosKey = `${x},${y},${dir}`;

		// Check for a loop by using the visited set
		if (visited.has(currentPosKey)) {
			return -1; // Loop detected
		}

		visited.add(currentPosKey);

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

	const result = map.flat().filter((cell) => cell === "X").length + 1;
	return result;
}
