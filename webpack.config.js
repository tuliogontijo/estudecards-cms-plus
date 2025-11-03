const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    entry: './src/content-script.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'content-script.bundle.js',
      clean: true,
    },
    
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024 // 8kb
            }
          },
          generator: {
            filename: 'img/[name].[hash][ext]'
          }
        }
      ],
    },
    
    watch: isDevelopment,
    watchOptions: {
      ignored: /node_modules/,
    },
    
    plugins: [
      new CopyPlugin({
        patterns: [
          { 
            from: "manifest.json", 
            to: "." 
          },
          { 
            from: "assets/icons", 
            to: "icons" 
          },
          {
            from: "src/styles", 
            to: "styles" 
          }
        ],
      }),
    ],
    
    optimization: {
      minimize: !isDevelopment,
    },
    
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@assets': path.resolve(__dirname, 'assets'),
        '@icons': path.resolve(__dirname, 'assets/icons'),
        '@img': path.resolve(__dirname, 'assets/img'),
      }
    }
  };
};
