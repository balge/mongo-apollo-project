const { terser } = require('rollup-plugin-terser')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')

module.exports = {
  input: 'index.ts',

  output: {
    file: 'dist/app.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: { module: 'ESNext' },
      },
    }),
    commonjs(),
    terser(),
  ],
}
