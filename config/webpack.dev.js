const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/client/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8000,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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
    
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/views/index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/main.css'
        }),
    
        new CleanWebpackPlugin({
            dry: true,
            verbose: false,
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false,
           
        }),
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true
      }), 
    ]
};