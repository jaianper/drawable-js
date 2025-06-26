import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'src/Drawable.js',
        output: {
            file: 'dist/drawable.js',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**'
            })
        ]
    },
    {
        input: 'src/Drawable.js',
        output: {
            file: 'dist/drawable.umd.js',
            format: 'umd',
            name: 'DrawableJS', // global name for browser
            sourcemap: true
        },
        plugins: [
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**'
            })
        ]
    }
];
