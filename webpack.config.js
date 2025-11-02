const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    entry: './src/content-script.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'content-script.bundle.js',
      clean: true, // Limpa pasta dist a cada build
    },
    
    // Source maps para debugging
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    
    // Watch mode para desenvolvimento
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
            from: "icons", 
            to: "icons" 
          },
          {
            from: "styles",
            to: "styles"
          }
        ],
      }),
    ],
    
    // Configurações para melhor debugging
    optimization: {
      minimize: !isDevelopment,
    },
    
    // Resolve para facilitar imports
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@services': path.resolve(__dirname, 'src/services'),
      }
    }
  };
};
