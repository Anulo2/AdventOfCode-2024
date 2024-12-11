export function part1(input: string): number {
	return process(input.trim().split(" ").map(Number), 25);
}

export function part2(input: string): number {
	return process(input.trim().split(" ").map(Number), 75);
}

const process = (data: number[], iterations: number): number => {
	let nums = data.reduce((acc, num) => {
		acc.set(num, (acc.get(num) || 0) + 1);
		return acc;
	}, new Map<number, number>());

	for (let i = 0; i < iterations; i++) {
		nums = Array.from(nums.entries()).reduce((newNums, [num, count]) => {
			const newNumsArray =
				num === 0
					? [1] // If the number is 0, add a 1 to the new numbers
					: (Math.floor(Math.log10(num)) + 1) % 2 === 0
						? [
								// If the number of digits is even, split the number
								Math.floor(num / 10 ** ((Math.floor(Math.log10(num)) + 1) / 2)),
								num % 10 ** ((Math.floor(Math.log10(num)) + 1) / 2),
							]
						: [num * 2024]; // If the number of digits is odd

			for (const newNum of newNumsArray) {
				newNums.set(newNum, (newNums.get(newNum) || 0) + count);
			}

			return newNums;
		}, new Map<number, number>());
	}

	return Array.from(nums.values()).reduce((sum, count) => sum + count, 0);
};
