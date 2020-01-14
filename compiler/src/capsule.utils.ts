import * as path from 'path';
import * as os from 'os';
import debug from 'debug';
import Vinyl from 'vinyl';

export interface GenericObject {
    [key: string]: any;
}

export interface CompilerContext {
    context: GenericObject;
    configFiles: Vinyl[];
    files: Vinyl[];
    rawConfig: GenericObject;
    dynamicConfig?: GenericObject;
    api?: any;
}

export function getCapsuleName(infix: string = '') {
  const uuidHack = `capsule-${infix ? `${infix}-` : ''}${Date.now()
    .toString()
    .slice(-5)}`;
  return path.join(os.tmpdir(), 'bit', uuidHack);
}

export async function isolate(cc: CompilerContext, isolateOptions?: GenericObject, capsulePath?: string) {
    if (process.env.DEBUG) {debug('console');}
    const api = cc.context;
    const targetDir = capsulePath || getCapsuleName();
    const componentName = api.componentObject.name;
    debug(`\n building ${componentName} on directory ${targetDir}`);
    const actualOpts = { ...{ targetDir, shouldBuildDependencies: true }, ...(isolateOptions || {}) };
    const res = await api.isolate(actualOpts);
  
    return { res, directory: targetDir };
}

  
