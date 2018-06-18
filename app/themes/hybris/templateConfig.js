module.exports = {

    entryLoader (component) {
        return {
            main: [
                './app/'+ component.type + '/' + component.name + '/js/main.js',
                './app/'+ component.type + '/' + component.name + '/scss/main.scss'
            ]
        };
    },

    outputLoader (component, production) {
        let dest = production ? 'dist/' : 'wp-core/wp-content/';
        return {
            path: __dirname + '/../../../' + dest + "/" + component.type + "/" + component.name + '/assets/',
            filename: '[name].js'
        };
    },

     copyPluginLoader (component, production) {
        let dest = production ? 'dist/' : 'wp-core/wp-content/';
        return [
            {
                from: './app/' + component.type + '/' + component.name + '/src/',
                to: __dirname + '/../../../' + dest + "/" + component.type + "/" + component.name + "/",
                ignore: [
                    '*Test.php',
                    'composer.*',
                    '.gitkeep',
                    'phpunit.xml'
                ]
            }
        ]

    }
};