import Vinyl from 'vinyl';

interface GenericObject {
    [key: string]: any;
}
// interface actionParams {
//     files: Vinyl[]
//     rawConfig: compiler.rawConfig, //object
//     dynamicConfig: compiler.dynamicConfig, // object
//     configFiles: compiler.files, // do not use
//     api: compiler.api, // logger and ?
//     context // see below
//   };
// const context: Record<string, any> = {
// componentObject: component.toObject(),
// rootDistDir, // string (path)
// componentDir,  // string (path)
// isolate: isolateFunc // function to isolate 
// };
// const isolateFunc = async ({
// targetDir,
// shouldBuildDependencies,
// installNpmPackages,
// keepExistingCapsule
// }: {
// targetDir?: string;
// shouldBuildDependencies?: boolean;
// installNpmPackages?: boolean;
// keepExistingCapsule?: boolean;
// }): Promise<ExtensionIsolateResult>
//  []