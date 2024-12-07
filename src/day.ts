import { processDay } from "./utils";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
	args: Bun.argv,
	options: {
		day: {
			type: "string",
			alias: "d",
			default: `${new Date().getDate()}`,
			description: "Day to run",
		},
	},
	strict: true,
	allowPositionals: true,
});

await processDay(Number(values.day));
