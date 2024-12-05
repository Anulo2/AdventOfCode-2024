type Rule = { before: number; after: number };

export function part1(input: string): number {
	const { rules, updates } = parseInput(input);

	return updates
		.filter((update) => isOrdered(update, rules))
		.map(getMiddleElement)
		.reduce((sum, num) => sum + num, 0);
}

export function part2(input: string): number {
	const { rules, updates } = parseInput(input);

	return updates
		.filter((update) => !isOrdered(update, rules))
		.map((update) => reorderUpdate(update, rules))
		.map(getMiddleElement)
		.reduce((sum, num) => sum + num, 0);
}

// Helper to parse input into rules and updates
function parseInput(input: string): { rules: Rule[]; updates: number[][] } {
	const [rulesSection, updatesSection] = input.trim().split("\r\n\r\n");

	const rules: Rule[] = rulesSection.split("\n").map((rule) => {
		const [before, after] = rule.split("|").map(Number);
		return { before, after };
	});

	const updates: number[][] = updatesSection
		.split("\n")
		.map((update) => update.split(",").map(Number));

	return { rules, updates };
}

// Check if an update array follows all rules
function isOrdered(update: number[], rules: Rule[]): boolean {
	return rules.every(({ before, after }) => {
		const beforeIndex = update.indexOf(before);
		const afterIndex = update.indexOf(after);
		return beforeIndex === -1 || afterIndex === -1 || beforeIndex < afterIndex;
	});
}

// Find the middle element of an array
function getMiddleElement(arr: number[]): number {
	return arr[Math.floor(arr.length / 2)];
}

// Reorder an update using topological sort
function reorderUpdate(update: number[], rules: Rule[]): number[] {
	const graph = new Map<number, Set<number>>();
	const inDegree = new Map<number, number>();

	// Initialize graph nodes and in-degrees
	for (const page of update) {
		graph.set(page, new Set());
		inDegree.set(page, 0);
	}

	// Build graph edges from rules
	for (const { before, after } of rules) {
		if (update.includes(before) && update.includes(after)) {
			graph.get(before)?.add(after);
			inDegree.set(after, (inDegree.get(after) || 0) + 1);
		}
	}

	// Perform topological sort
	const queue = Array.from(inDegree.entries())
		.filter(([, degree]) => degree === 0)
		.map(([node]) => node);

	const sorted: number[] = [];
	while (queue.length > 0) {
		const node = queue.shift();
		if (node === undefined) {
			throw new Error("Queue is empty");
		}
		sorted.push(node);

		for (const neighbor of graph.get(node) || []) {
			const currentInDegree = inDegree.get(neighbor);
			if (currentInDegree !== undefined) {
				inDegree.set(neighbor, currentInDegree - 1);
			}
			if (inDegree.get(neighbor) === 0) {
				queue.push(neighbor);
			}
		}
	}

	return sorted;
}
