import fs from "fs";
import { WavesWriter } from "./index.js";
import path from "path";
import os from "os";
import { strictEqual as equal } from "assert";

export async function testWaves(): Promise<void> {
	const text = "waves testing by ascen";
	/*
	 * Create dir path
	 */
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "waves-test"));
	/*
	 * Create file path
	 */
	const file = path.join(dir, "waves-test.txt");
	console.log("File", file);

	const waves = new WavesWriter(file);
	const promises = [];

	/*
	 * Add some data in file
	 */
	promises.push(waves.write(text));

	await Promise.all(promises);
	equal(fs.readFileSync(file, "utf-8"), text);
}
