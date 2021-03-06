import fs from 'fs-extra';
import Vinyl from 'vinyl';
import path from 'path';
import readdir from 'recursive-readdir';

function mapExtensions (extensions: Array<String>) {
    return extensions.map(e => `.${e}`);
}

/**
 * Return all source files (not tests) with specific extensions or [] for all
 * @param sources list of sources to review
 * @param extensions list of extensions to match
 */
export function getSourceFiles(sources: Array<Vinyl>, extensions: Array<String> = []) : Array<Vinyl> {
    return sources.filter(s => (
        extensions.length > 0 ? mapExtensions(extensions).includes(s.extname) : true) && !s.test
    );
}

/**
 * Return all tests files with specific extensions or [] for all
 * @param sources list of sources to review
 * @param extensions list of extensions to match
 */
export function getTestFiles (sources: Array<Vinyl>, extensions: Array<String> = []) : Array<Vinyl> {
    return sources.filter(s => (
        extensions.length > 0 ? mapExtensions(extensions).includes(s.extname) : true) && !!s.test
    );
}

/**
 * Return files in directory as set of Vinyls relative to the dist directory
 * @param path Path to read files from
 */
export async function readFiles (dir: string): Promise<Array<Vinyl> | undefined> {
    const dirFiles = await readdir(dir);
    let files = dirFiles.map(async f => {
        return new Vinyl({
            path: path.relative(dir, f),
            contents: await fs.readFile(f)
        });
    });
    return  Promise.all(files);
}
