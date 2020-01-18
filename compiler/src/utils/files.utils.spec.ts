import { getSourceFiles, getTestFiles , findMainFile } from './files.utils';
import Vinyl from 'vinyl';

describe ('files utils', () => {

    const files = [
        new Vinyl({
            path: './folder/a.ts',
            test: false
        }),
        new Vinyl({
            path: './folder/b.js',
            test: false
        }),
        new Vinyl({
            path: './folder/c.jpg',
            test: false
        }),
        new Vinyl({
            path: './folder/d.ts',
            test: true
        }),

    ];
    describe ('sources', () => {
        it ('should return source files that match extensions', () => {
            expect(getSourceFiles(files, ['ts']).length).toEqual(1);
            expect(getSourceFiles(files, ['ts', 'js']).length).toEqual(2);
            expect(getSourceFiles(files, []).length).toEqual(3);
        });
    });
    describe ('tests', () => {
        it ('should return test files that match extensions', () => {
            expect(getTestFiles(files, ['ts']).length).toEqual(1);
            expect(getTestFiles(files, ['ts', 'js']).length).toEqual(1);
            expect(getTestFiles(files, []).length).toEqual(1);
        });
    });
})