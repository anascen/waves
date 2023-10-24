import { PathLike } from "fs";
import { rename, writeFile } from "fs/promises";
import { basename, dirname, join } from "path";

/*
 * Returns a temporary file path
 * Example: for /some/file will return /some/.file.tmp
 */
const getTempFilePath = (file: PathLike) => {
    return join(dirname(file.toString()), `.${basename(file.toString())}.tmp`);
};

type Resolve = () => void;
type Reject = (error: Error) => void;

export class WavesWriter {
    #filename: PathLike;
    #tempFilename: PathLike;
    #locked: boolean = false;
    #prev: [Resolve, Reject] | null = null;
    #next: [Resolve, Reject] | null = null;
    #nextPromise: Promise<void> | null = null;
    #nextData: string | null = null;

    /*
     * File is locked, add data for later
     */
    #add(data: string): Promise<void> {
        /*
         * Most recent data only
         */
        this.#nextData = data;

        /*
         * Create a singleton promise to resolve all next promises once next data is written
         */
        this.#nextPromise ||= new Promise((resolve, reject) => {
            this.#next = [resolve, reject];
        });

        /*
         * Returns a promise that will resolve at the same time as next promise
         */
        return new Promise((resolve, reject) => {
            this.#nextPromise?.then(resolve).catch(reject);
        });
    }

    /*
     * When File isn't locked, add data for later
     */
    async #write(data: string): Promise<void> {
        /*
         * set Locked file to true
         */
        this.#locked = true;

        try {
            /*
             * Create and write in file
             */
            await writeFile(this.#tempFilename, data, "utf-8");

            /*
             * Rename filename
             */
            await rename(this.#tempFilename, this.#filename);

            /*
             * Call resolve
             */
            this.#prev?.[0]();
        } catch (error) {
            /*
             * Call reject
             */
            if (error instanceof Error) {
                this.#prev?.[1](error);
            }
            throw error;
        } finally {
            /*
             * Unlock the file
             */
            this.#locked = false;

            this.#prev = this.#next;
            this.#next = this.#nextPromise = null;

            if (this.#nextData !== null) {
                const nextData = this.#nextData;
                this.#nextData = null;
                await this.#write(nextData);
            }
        }
    }

    constructor(filename: PathLike) {
        /*
         * Set file name
         */
        this.#filename = filename;
        this.#tempFilename = getTempFilePath(filename);
    }

    async write(data: string): Promise<void> {
        return this.#locked ? this.#add(data) : this.#write(data);
    }
}
