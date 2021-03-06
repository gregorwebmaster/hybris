module.exports = {

    entryLoader (template) {
        return {
            main: [
                './app/themes/' + template + '/js/main.js',
                './app/themes/' + template + '/scss/main.scss'
            ]
        };
    },

    outputLoader (template) {
        return {
            path: __dirname + '/../../../themes/' + template + '/assets/',
            filename: '[name].js'
        };
    },

     copyPluginLoader (template) {
        let output = __dirname + '/../../../themes/' + template ;
        return [
            {
                from: './app/themes/'+template+'/src/',
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