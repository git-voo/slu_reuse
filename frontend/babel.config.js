module.exports = {
    presets: [
      '@babel/preset-env', // Transpiles modern JavaScript
      '@babel/preset-react', // Transpiles JSX
    ],
  };
module.exports = {
  // Transform modern JS and JSX files using Babel
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  // Allow transformation of node_modules for specific packages like axios
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)'  // Include axios for transformation
  ],
  // Optionally, add more Jest config options as needed
};
  