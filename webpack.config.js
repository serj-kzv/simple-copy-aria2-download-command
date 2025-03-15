import path from 'path'
import {fileURLToPath} from 'url'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const firefox = 135;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.resolve(__dirname, 'dist');
const context = path.resolve(__dirname, 'src');
const toType = 'template';

export default (_, {mode}) => ({
    mode,
    entry: {
        background: './src/background.js',
        content: './src/content.js',
        option: './src/option/option.js'
    },
    output: {path: dist, filename: '[name].js'},
    resolve: {modules: [context, 'node_modules']},
    devtool: mode === 'production' ? false : 'source-map',
    target: 'web',
    watchOptions: {ignored: /node_modules/, poll: 500},
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {presets: [['@babel/preset-env', {targets: {firefox}}]]}
            }
        }]
    },
    optimization: mode === 'production' ? {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: 2024,
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.debug', 'console.warn', 'console.info', 'console.error']
                }
            }
        })]
    } : {},
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {from: '_locales/**', to: '[path][name][ext]', context},
                {from: 'assets/**', to: '[name][ext]', context},
                {from: 'manifest.json', to: '[name][ext]', context, toType},
                {from: 'icon.svg', to: '[name][ext]', context, toType},
                {from: 'option/option.css', to: '[name][ext]', context, toType},
                {from: 'option/option.html', to: '[name][ext]', context, toType}
            ]
        })
    ]
})
