const vueCli = require('@vue/cli-service');
const path = require('path');

//Things to do: 
// generate .eslint.js
//generate tsconfig.json. it contains as include all the filenames
//all packages as defined in the 

const service = new vueCli(process.cwd());

const tsBase = {
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "jsx": "preserve",
        "importHelpers": true,
        "noImplicitAny": false,
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "allowJs": true,
        "sourceMap": true,
        "baseUrl": ".",
        "typeRoots" : ["./node_modules/@types", "./typings"],
        "types": [
            "node",
            "webpack-env"
        ],
        "paths": {
            "@/*": [
                "./*"
            ],
            "~/*": [
                "./*"
            ]
        },
        "lib": [
            "esnext",
            "dom",
            "dom.iterable",
            "scripthost"
        ]
    },
    "include": [
        "components/hello-world2/HelloWorld2.vue"
    ],
    "exclude": [
        "node_modules"
    ]
};

let rootPath = '../capsule/components/hello-world2/';
service.run('build', {
    entry: path.join(rootPath, 'HelloWorld2.vue'), //should be component main file of course
    target: 'lib',
    name: 'hello-world', //component name
    formats: ['commonjs'],
    dest: path.join(rootPath, 'dist')
}).catch((err: any) => {
    console.log(err);
    process.exit(1)
})
