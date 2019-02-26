import AppDefinition from './AppDefinition.js';

const name = AppDefinition.identifier;

tasks.push({
    input: './AppDefinition.js',
    output: {
        file: './dist/mpk/appBundle.js',
        format: 'iife',
        name: 'APP_' + name.replace(/\./g, '_')
    }
});

export default tasks