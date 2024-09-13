const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/client/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        libraryTarget: 'var',
        library: 'Client'
        
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                      },
                }
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader', 'sass-loader']
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name : '[name].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/'

                        }
                    }
                ],
            },
            {
                test: /\.(html)$/,
                use: [{
                    loader: 'html-loader',
                }]
            }
            
        ]
    },
    
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
        minimize: true,
      },
    plugins: [
        new HtmlWebpackPlugin(
            {
            template: "./src/client/views/index.html",
            filename: "./index.html"
        }
    ),
        new CleanWebpackPlugin(),
        
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        })
    

    ]
};