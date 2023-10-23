import fs from "fs";
import fsp from "fs/promises";
import { WavesWriter } from "./index.js";
import os from "os";
import path from "path";

const benchmark = async (data: string, msg: string): Promise<void> => {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "waves"));
    const labelFs = "  fs  ";
    const labelWaves = "  waves  ";
    const fsFile = path.join(dir, "fs.txt");
    const wavesFile = path.join(dir, "waves.txt");
    const waves = new WavesWriter(wavesFile);

    console.log(msg);
    console.log();

    console.time(labelFs);
    for (let i = 0; i < 1000; i++) {
        await fsp.writeFile(fsFile, `${data}${i}`);
    }
    console.timeEnd(labelFs);

    console.time(labelWaves);
    /*
     * waves can be run in parallel
     */
    await Promise.all(
        [...Array(1000).keys()].map((_, i) => waves.write(`${data}${i}`))
    );
    console.timeEnd(labelWaves);

    /*
     * Testing that the end result is the same
     */
    console.log();
    console.log(
        "  fs.txt = waves.txt",
        fs.readFileSync(fsFile, "utf-8") === fs.readFileSync(wavesFile, "utf-8")
            ? "✓"
            : "✗"
    );
    console.log();
    console.log();
};

async function run(): Promise<void> {
    const KB = 1024;
    const MB = 1048576;
    await benchmark(
        Buffer.alloc(KB, "x").toString(),
        "Write 1KB data to that file x 1000"
    );
    await benchmark(
        Buffer.alloc(MB, "x").toString(),
        "Write 1MB data to that file x 1000"
    );
}

void run();
