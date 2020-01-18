import path from 'path';
import debug from 'debug';
const vueCli = require('@vue/cli-service');

import {TSConfig} from './tsconfig';
import { vueConfig } from './vueConfig';

import {
    ActionReturnType,
    BuildParams,
    createCapsule, 
    destroyCapsule, 
    getSourceFiles, 
    readFiles, 
} from './utils';

if (process.env.DEBUG) {debug('build');}
const COMPILED_EXTS = ['vue', 'ts', 'tsx'];

async function runBuild (options: BuildParams): Promise<any> {
    const {componentPath, mainFile, componentName} = options;
    const service = new vueCli(process.cwd());
    return service.run('build', {
        entry: path.join(componentPath, mainFile), 
        target: 'lib',
        name: componentName,
        formats: ['commonjs'],
        dest: path.join(componentPath, 'dist')
    }); 
}

export async function run (actionParams: any, _:any, context: any) : Promise<ActionReturnType> {

    const {componentObject, rootDistDir, componentDir, isolate} = context;
    
    // build capsule
    const { res, directory} = await createCapsule(isolate, { shouldBuildDependencies: true})

    // Get compilation Files
    const fs = res.capsule.fs;
    let files : Array<any> = res.componentWithDependencies.component.toObject().files;
    let sources = getSourceFiles(files, COMPILED_EXTS);
    
    // write TS config into capsule
    let TS = Object.assign(TSConfig, {
        include: sources.map(s => path.join(componentDir, s.path)),
    });
    await fs.writeFile('tsconfig.json', JSON.stringify(TS, null, 4));

    //write Vue config into capsule
    await fs.writeFile('vue.config.js', `module.exports=${JSON.stringify(vueConfig)}`);

    const buildParams: BuildParams = {
        componentPath: directory,
        mainFile: componentObject.mainFile,
        componentName: componentObject.name
    }
    try {
        await runBuild(buildParams);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    const dists = await readFiles(path.join(directory, 'dist'));
    const mainFile = dists?.find(f => f.path.endsWith(`${componentObject.name}.common.js`));
    console.log(mainFile);
    destroyCapsule(res.capsule)
    return {
        mainFile: mainFile && mainFile.path , 
        dists: dists || []
    }
}
