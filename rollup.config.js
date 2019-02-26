const tasks = []

tasks.push({
    input: './AppDefinition.js',
    output: {
        file: './dist/release/js/src/appBundle.js',
        format: 'iife',
        name: 'appBundle'
    }
});

export default tasks