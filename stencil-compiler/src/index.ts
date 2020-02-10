import * as path from 'path';
import debug from 'debug';
import * as fs from 'fs-extra';

import {compile} from '@stencil/core/compiler/stencil.js';

( async function () {
    const filePath = path.join(process.cwd(), '../workspace/components/my-component/components/my-component/my-component.tsx');
    console.log(filePath);
})();

//const COMPILED_EXTS = ['ts', 'tsx'];

import {
    CompilerContext,
    ActionReturnType,
    createCapsule, 
    destroyCapsule, 
//    getSourceFiles, 
    readFiles
} from '@bit/bit.envs.common.utils';

if (process.env.DEBUG) {debug('build');}

export function getDynamicPackageDependencies() {
    return {}
}

export function getDynamicConfig(ctx: CompilerContext) {
    return ctx.rawConfig;
}

export async function action (ctx: CompilerContext) : Promise<ActionReturnType> {

    const {context} = ctx;
    const {componentObject, isolate} = context;

    // build capsule
    const { res, directory} = await createCapsule(isolate, { shouldBuildDependencies: true})   
    const distDir = path.join(directory, 'dist');
    //let sources: Array<Vinyl> = getSourceFiles(files, COMPILED_EXTS);
    
    try {
        console.log('DIR', directory);
        console.log('main', componentObject.mainFile);
        const source = await fs.readFile(path.join(directory, componentObject.mainFile));
        let res = await compile(source.toString());
        console.log('RES', res);
        await fs.ensureDir(distDir);
        await fs.writeFile(path.join(distDir, 'comp.js'),res.code);
        
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    //get dists and main file
    const dists = await readFiles(distDir);
    console.log('DISTS', dists);
    destroyCapsule(res.capsule)
    return {
        mainFile: `${componentObject.name}.common.js`, 
        dists: dists || []
    }
}
