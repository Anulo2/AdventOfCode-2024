import { traverseMap } from "./utils";

declare const self: Worker;

self.onmessage = (event: MessageEvent) => {
	// console.log("Begin OnMessage Worker");
	const { map, startX, startY, startDir, x, y } = event.data;
	self.postMessage({
		steps: traverseMap(map, [startX, startY, startDir]),
		id: { x, y },
	});
	// console.log("End OnMessage Worker");
};

self.addEventListener("error", (event) => {
	console.log(`Error Worker: ${event.error}`);
});

self.addEventListener("close", (event) => {
	self.terminate();
});
