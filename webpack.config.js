let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let LiveReloadPlugin = require("webpack-livereload-plugin");
let CopyWebpackPlugin = require("copy-webpack-plugin");
let shell = require("shelljs");
var path = require('path');
let components = require('./config/webpack.js');

let production = process.env.NODE_ENV === "production" ? true : false;
production ? console.log("Enable production mode.") : null;


module.exports = components.map(component => {
    let templateConfig = require("./app/" + component.type + "/" + component.name + "/templateConfig.js");
    let workdir = __dirname;

    if (component.composer && shell.cd("./app/" + component.type + "/" + component.name + "/src") && shell.exec("composer install").code !== 0) {
        shell.echo("Error: Can not install composer");
        shell.exit(1);
    }

    shell.cd(workdir);

    let templateModules = {
        entry: templateConfig.entryLoader(component),

        output: templateConfig.outputLoader(component, production),

        module: {
            rules: [{
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },

                {
                    test: /\.s[ac]ss$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                                loader: "css-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'postcss-loader', 
                                options: {
									sourceMap: true,
                                    plugins: function() {
                                        return [
                                            require('precss'),
                                            require('autoprefixer')
                                        ];
                                    }
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true,
                                    includePaths: [
                                        path.resolve(__dirname, "./node_modules/foundation-sites"),
                                        path.resolve(__dirname, "./node_modules/@fortawesome/fontawesome-free-webfonts"),
                                        __dirname + "/app/" + component.type + "/" + component.name + "/images"
                                    ]
                                }
                            }
                        ],
                        fallback: "style-loader"
                    })
                },

                {
                    test: /\.png|jpe?g|gif$/,
                    loaders: [{
                            loader: "file-loader",
                            options: {
                                name: "../images/[name].[ext]"
                            }
                        },

                        "img-loader"
                    ]
                },

                {
                    test: /\.svg$/,
                    loader: "file-loader",
                    options: {
                        name: "../images/[name].[ext]"
                    },
                    include: [
                        __dirname + "./app/" + component.type + "/" + component.name + "/images"
                    ]
                },

                {
                    test: /\.eot|ttf|woff|woff2|svg$/,
                    loader: "file-loader",
                    options: {
                        name: "../fonts/[name].[ext]"
                    },
                    include: [
                        __dirname + "/app/" + component.type + "/" + component.name + "/fonts",
                        __dirname + "/node_modules/@fortawesome/fontawesome-free-webfonts"
                    ]
                },

                {
                    test: /\.js/,
                    loader: "babel-loader",
                    exclude: /node_modues/
                }
            ]
        },

        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                moment: "moment",
                Ps: "perfect-scrollbar"
            }),
            new CopyWebpackPlugin(
                templateConfig.copyPluginLoader(component, production)
            )
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
    }
     else {
    	templateModules.plugins.push(
    		new LiveReloadPlugin({
    			protocol: "http",
    			appendScriptTag: false
    		})
    	);
    }

    return templateModules;
});