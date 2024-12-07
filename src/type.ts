export type DayScript = {
	part1: (input: string) => number | string | Promise<number | string>;
	part2: (input: string) => number | string | Promise<number | string>;
};
