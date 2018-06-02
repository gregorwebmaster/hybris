let webpack = require('webpack');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let LiveReloadPlugin = require('webpack-livereload-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');


let production = (process.env.NODE_ENV === 'production') ? true : false;

production ? console.log('Enable production mode.') : null;

let templates = ['hybris'];

module.exports = templates.map(template => {

    let templateConfig = require( './app/themes/' + template + '/templateConfig.js');

    let templateModules = {

        entry: templateConfig.entryLoader (template),

        output: templateConfig.outputLoader(template, production),

        module: {

            rules: [

                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },


                {
                    test: /\.s[ac]ss$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true,
                                    includePaths: [
                                        __dirname + './node_modules/foundation-sites/scss',
                                        __dirname + '/app/themes/' + template + '/images'
                                    ]
                                }
                            }
                        ],
                        fallback: "style-loader"
                    })
                },


                {
                    test: /\.png|jpe?g|gif$/,
                    loaders: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '../images/[name].[ext]'
                            }
                        },

                        'img-loader'
                    ]

                },

                {
                    test: /\.svg$/,
                    loader: 'file-loader',
                    options: {
                        name: '../images/[name].[ext]'
                    },
                    include: [
                        __dirname + '/app/themes/' + template + '/images'
                    ]
                },


                {
                    test: /\.eot|ttf|woff|woff2|svg$/,
                    loader: 'file-loader',
                    options: {
                        name: '../fonts/[name].[ext]'
                    },
                    include: [
                        __dirname + '/app/themes/' + template + '/fonts'
                    ]
                },


                {
                    test: /\.js/,
                    loader: 'babel-loader',
                    exclude: /node_modues/
                }
            ]
        },

        plugins: [
            new ExtractTextPlugin('[name].css'),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                moment: "moment",
                Ps: 'perfect-scrollbar'
            }),
            new CopyWebpackPlugin(templateConfig.copyPluginLoader(template))
        ]
    };

    if (production) {
        templateModules.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false
            })
        );
    } else {

        templateModules.plugins.push(
            new LiveReloadPlugin({
                protocol: 'http',
                hostname: 'localhost',
                appendScriptTag: true
            })
        );
    }

    return templateModules;
});
