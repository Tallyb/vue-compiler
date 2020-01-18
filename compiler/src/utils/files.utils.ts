import fs from 'fs-extra';
import Vinyl from 'vinyl';
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
 * Return the main file with .js extension and the required name
 * @param main the main file to match (with no extension)
 * @param outputs the list of Vinyls for inspection 
 */
export function findMainFile(main: string, suffix: string, files: Array<Vinyl> = []): Vinyl | undefined {
    if (!main) return undefined;
    const mainFile = new Vinyl({
        path: main
    })
    return files.find(f => {
        console.log (mainFile.stem, f.stem, f.extname);
        return (mainFile.stem === f.stem) && f.path.endsWith(suffix);
    });
}

/**
 * Return files in directory as set of Vinyls
 * @param path Path to read files from
 */
export async function readFiles (dir: string): Promise<Array<Vinyl> | undefined> {
    const files = await readdir(dir);
    const contents = await Promise.all(files.map(f => fs.readFile(f)));
    return files.map((f, i) => {
        return new Vinyl({
            path: f,
            contents: contents[i]
        });
    });
}