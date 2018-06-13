let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let LiveReloadPlugin = require("webpack-livereload-plugin");
let CopyWebpackPlugin = require("copy-webpack-plugin");
let shell = require("shelljs");
var path = require('path');

let production = process.env.NODE_ENV === "production" ? true : false;

production ? console.log("Enable production mode.") : null;

let templates = [{
    component: "themes",
    module: "hybris",
    composer: true
}];

module.exports = templates.map(template => {
    let templateConfig = require("./app/" + template.component + "/" + template.module + "/templateConfig.js");

    if (template.composer && shell.cd("./app/" + template.component + "/" + template.module + "/src") && shell.exec("composer install").code !== 0) {
        shell.echo("Error: Can not install composer");
        shell.exit(1);
    }

    shell.cd("../../../..");

    let templateModules = {
        entry: templateConfig.entryLoader(template.module),

        output: templateConfig.outputLoader(template.module, production),

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
                                        __dirname + "/app/themes/" + template + "/images"
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
                        __dirname + "./app/" + template.component + "/" + template.module + "/images"
                    ]
                },

                {
                    test: /\.eot|ttf|woff|woff2|svg$/,
                    loader: "file-loader",
                    options: {
                        name: "../fonts/[name].[ext]"
                    },
                    include: [
                        __dirname + "/app/" + template.component + "/" + template.module + "/fonts",
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
                templateConfig.copyPluginLoader(template.module)
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
    			hostname: "localhost",
    			appendScriptTag: false
    		})
    	);
    }

    return templateModules;
});