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
        dest = production ? 'diest/' : 'wp-core/wp-content/';
        return {
            path: __dirname + '/../../../dist/' + component.type + "/" + component.name + '/assets/',
            filename: '[name].js'
        };
    },

     copyPluginLoader (component) {
        let output = __dirname + '/../../../themes/' + component ;
        return [
            {
                from: './app/' + component.type + '/' + component.name + '/src/',
                to: output + '/',
                ignore: [
                    '*Test.php',
                    'composer.*',
                    '.gitkeep'
                ]
            }
        ]

    }
};