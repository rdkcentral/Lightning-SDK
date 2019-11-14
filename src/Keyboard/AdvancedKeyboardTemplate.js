const template = {
    keyWidth: 64,
    keyHeight: 84,
    horizontalSpacing: 8,
    verticalSpacing: 12,
    layouts: {
        'ABC': {
            rows: [
                {
                    keys: [
                        {c: 'Q'},
                        {c: 'W'},
                        {c: 'E'},
                        {c: 'R'},
                        {c: 'T'},
                        {c: 'Y'},
                        {c: 'U'},
                        {c: 'I'},
                        {c: 'O'},
                        {c: 'P'}
                    ]
                },
                {
                    x: 34,
                    keys: [
                        {c: 'A'},
                        {c: 'S'},
                        {c: 'D'},
                        {c: 'F'},
                        {c: 'G'},
                        {c: 'H'},
                        {c: 'J'},
                        {c: 'K'},
                        {c: 'L'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'abc', c: 'Aa', w: 98},
                        {c: 'Z'},
                        {c: 'X'},
                        {c: 'C'},
                        {c: 'V'},
                        {c: 'B'},
                        {c: 'N'},
                        {c: 'M'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '#123', w: 136, c: '#123'},
                        {c: ','},
                        {action: 'space', c: '', w: 276},
                        {c: '.'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        },
        'abc': {
            rows: [
                {
                    keys: [
                        {c: 'q'},
                        {c: 'w'},
                        {c: 'e'},
                        {c: 'r'},
                        {c: 't'},
                        {c: 'y'},
                        {c: 'u'},
                        {c: 'i'},
                        {c: 'o'},
                        {c: 'p'}
                    ]
                },
                {
                    x: 34,
                    keys: [
                        {c: 'a'},
                        {c: 's'},
                        {c: 'd'},
                        {c: 'f'},
                        {c: 'g'},
                        {c: 'h'},
                        {c: 'j'},
                        {c: 'k'},
                        {c: 'l'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'ABC', c: 'aA', w: 98},
                        {c: 'z'},
                        {c: 'x'},
                        {c: 'c'},
                        {c: 'v'},
                        {c: 'b'},
                        {c: 'n'},
                        {c: 'm'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '#123', w: 136, c: '#123'},
                        {c: ','},
                        {action: 'space', c: '', w: 276},
                        {c: '.'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        },
        '#123': {
            rows: [
                {
                    keys: [
                        {c: '1'},
                        {c: '2'},
                        {c: '3'},
                        {c: '4'},
                        {c: '5'},
                        {c: '6'},
                        {c: '7'},
                        {c: '8'},
                        {c: '9'},
                        {c: '0'}
                    ]
                },
                {
                    x: 34,
                    keys: [
                        {c: '@'},
                        {c: '#'},
                        {c: '€'},
                        {c: '_'},
                        {c: '&'},
                        {c: '-'},
                        {c: '+'},
                        {c: '('},
                        {c: ')'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '{&=', c: '{&=', w: 98},
                        {c: '*'},
                        {c: '\"'},
                        {c: '\''},
                        {c: ':'},
                        {c: ';'},
                        {c: '!'},
                        {c: '?'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'ABC', w: 136, c: 'ABC'},
                        {c: ','},
                        {action: 'space', c: '', w: 276},
                        {c: '.'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        },
        '{&=': {
            rows: [
                {
                    keys: [
                        {c: '~'},
                        {c: '\`'},
                        {c: '|'},
                        {c: '\u2022'},
                        {c: '√'},
                        {c: 'π'},
                        {c: '\u00f7'},
                        {c: '\u00d7'},
                        {c: '¶'},
                        {c: '∆'}
                    ]
                },
                {
                    keys: [
                        {c: '£'},
                        {c: '¥'},
                        {c: '€'},
                        {c: '¢'},
                        {c: '^'},
                        {c: '°'},
                        {c: '='},
                        {c: '{'},
                        {c: '}'},
                        {c: 'a'}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: '#123', c: '#123', w: 98},
                        {c: '%'},
                        {c: '©'},
                        {c: '®'},
                        {c: '™'},
                        {c: '\u2713'},
                        {c: '['},
                        {c: ']'},
                        {action: 'backspace', w: 98, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {action: 'toggleToLayout', toLayout: 'ABC', w: 136, c: 'ABC'},
                        {c: '<'},
                        {action: 'space', c: '', w: 276},
                        {c: '>'},
                        {action: 'hideKeyboard', w: 136, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                }
            ]
        }
    }
};

export default template;