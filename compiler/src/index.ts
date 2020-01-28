import path from 'path';
import debug from 'debug';
import fs from 'fs-extra';
const vueCli = require('@vue/cli-service');

import {TSConfig} from './tsconfig';
import { vueConfig } from './vueConfig';

import {
    CompilerContext,
    ActionReturnType,
    createCapsule, 
    destroyCapsule, 
    getSourceFiles, 
    readFiles
} from './utils';

if (process.env.DEBUG) {debug('build');}
const COMPILED_EXTS = ['vue', 'ts', 'tsx'];

export function getDynamicPackageDependencies(ctx: CompilerContext, name?: string) {
    console.log('DYNAMIC PKG DEPS CTX', ctx, name);
    return {}
}

export function getDynamicConfig(ctx: CompilerContext) {
    console.log('DYNAMIC CONFIG CTX', ctx)
    return ctx.rawConfig;
  }


export async function action (ctx: CompilerContext) : Promise<ActionReturnType> {

    const {context, configFiles, files, rawConfig, dynamicConfig, api} = ctx;
    const {componentObject, rootDistDir, componentDir, isolate} = context;

    console.log('CONTEXT', context);
console.log('API', api)
console.log('RAW', rawConfig),
console.log('DYNAMIC', dynamicConfig);
console.log('CONFIG', configFiles)
console.log('FILES', files)
    // build capsule
    const { res, directory} = await createCapsule(isolate, { shouldBuildDependencies: true})   
    const distDir = path.join(directory, 'dist');
    
    // write TS config into capsule
    let sources = getSourceFiles(files, COMPILED_EXTS);
    let TS = Object.assign(TSConfig, {
        include: sources.map(s => s.path),
    });
    await fs.writeFile(path.join(directory, 'tsconfig.json'), JSON.stringify(TS, null, 4));

    //write Vue config into capsule
    await fs.writeFile(path.join(directory, 'vue.config.js'), `module.exports=${JSON.stringify(vueConfig)}`);

    try {
        const service = new vueCli(process.cwd());
        await service.run('build', {
            entry: path.join(directory, componentObject.mainFile), 
            target: 'lib',
            name: componentObject.name,
            formats: ['commonjs'],
            dest: distDir
        }); 
    
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    //get dists and main file
    const dists = await readFiles(distDir);

    destroyCapsule(res.capsule)
    return {
        mainFile: `${componentObject.name}.common.js`, 
        dists: dists || []
    }
}
