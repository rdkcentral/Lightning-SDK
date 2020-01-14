import babel from 'rollup-plugin-babel'

export default [
  {
    input: './support/startApp.es6.js',
    plugins: [
      babel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                chrome: '44',
              },
              spec: true,
              debug: false,
            },
          ],
        ],
        plugins: ['@babel/plugin-transform-spread', '@babel/plugin-transform-parameters'],
      }),
    ],
    output: {
      file: './support/startApp.js',
      format: 'cjs',
    },
  },
]
