const vueCli = require('@vue/cli-service');
const path = require('path');
import * as fs from 'fs-extra';
import debug from 'debug';
import {getCapsuleName} from './capsule.utils';
import {TSConfig} from './tsconfig';
import { vueConfig } from './vueConfig';

const COMPILED_EXTS = ['vue', 'ts', 'tsx'];

interface BuildParams {
    componentPath: string;
    mainFile: string;
    componentName: string;
}
async function runBuild (options: BuildParams): Promise<any> {
    const {componentPath, mainFile, componentName} = options;
    const service = new vueCli(process.cwd());
    return service.run('build', {
        entry: path.join(componentPath, mainFile), //should be component main file of course
        target: 'lib',
        name: componentName,
        formats: ['commonjs'],
        dest: path.join(componentPath, 'dist')
    }); 
}

export async function run (actionParams: any, _:any, context: any) : Promise<void> {

    if (process.env.DEBUG) {debug('build');}

    const {componentObject, rootDistDir, componentDir, isolate} = context;
    
    // build capsule
    const targetDir = getCapsuleName();
    debug(`\n building ${componentObject.name} on directory ${targetDir}`);
    const isolateOptions = {};
    const actualOpts = { ...{ targetDir, shouldBuildDependencies: true }, ...isolateOptions };
    let res = await isolate(actualOpts);
    
    // Get compilation Files
    const capsulePath = res.capsule.container.path;
    let sources : Array<any> = res.componentWithDependencies.component.toObject().files;
    let compiledSources = sources.filter(s => COMPILED_EXTS.includes(s.extname));
    let nonCompiledSources = sources.filter(s => !COMPILED_EXTS.includes(s.extname));
    compiledSources = sources.map(s => path.join(componentDir, s.path));
    console.log(capsulePath);

    // write TS config into capsule
    let TS = Object.assign(TSConfig, {
        include: compiledSources,
    });
    console.log(capsulePath);
    console.log(path.join(capsulePath, 'vue.config.js'));
    await fs.writeFile(path.join(capsulePath, 'tsconfig.json'), JSON.stringify(TS, null, 4));

    //write Vue config into capsule
    await fs.writeFile(path.join(capsulePath, 'vue.config.js'), vueConfig.toString());

    const build: BuildParams = {
        componentPath: capsulePath,
        mainFile: componentObject.mainFile,
        componentName: componentObject.name
    }
    try {
        res = await runBuild(build); 
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    //copy non compiled sources to dist
    
}
