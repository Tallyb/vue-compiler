//const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
    configureWebpack: {
        resolve: {
            symlinks: false // support npm link
        },
        plugins: [
            //new VuetifyLoaderPlugin()
        ]
    }
}