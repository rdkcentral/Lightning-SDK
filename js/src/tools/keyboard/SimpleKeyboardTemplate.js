const template = {
    keyWidth: 74,
    keyHeight: 74,
    horizontalSpacing: 8,
    verticalSpacing: 12,
    layouts: {
        'ABC': {
            rows: [
                {
                    keys: [
                        {c: 'A'},
                        {c: 'B'},
                        {c: 'C'},
                        {c: 'D'},
                        {c: 'E'},
                        {c: 'F'},
                        {c: 'G'},
                        {action: 'backspace', w: 148, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {c: 'H'},
                        {c: 'I'},
                        {c: 'J'},
                        {c: 'K'},
                        {c: 'L'},
                        {c: 'M'},
                        {c: 'N'},
                        {action: 'toggleToLayout', toLayout: '#123', w: 148, c: '#123'}
                    ]
                },
                {
                    keys: [
                        {c: 'O'},
                        {c: 'P'},
                        {c: 'Q'},
                        {c: 'R'},
                        {c: 'S'},
                        {c: 'T'},
                        {c: 'U'}
                    ]
                },
                {
                    keys: [
                        {c: 'V'},
                        {c: 'W'},
                        {c: 'X'},
                        {c: 'Y'},
                        {c: 'Z'},
                        {c: '-'},
                        {c: '\''}
                    ]
                },
                {
                    keys: [
                        {action: 'space', c: 'space', w: 183},
                        {action: 'clear', c: 'delete', w: 183},
                        {action: 'ok', c: 'ok', w: 183}
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
                        {c: '&'},
                        {c: '#'},
                        {c: '('},
                        {c: ')'},
                        {action: 'backspace', w: 148, patch: {mountY: 0.33, text: {text: '', fontFace: 'Material-Icons', fontSize: 55}}}
                    ]
                },
                {
                    keys: [
                        {c: '4'},
                        {c: '5'},
                        {c: '6'},
                        {c: '@'},
                        {c: '!'},
                        {c: '?'},
                        {c: ':'},
                        {action: 'toggleToLayout', toLayout: 'ABC', w: 148, c: 'ABC'}
                    ]
                },
                {
                    keys: [
                        {c: '7'},
                        {c: '8'},
                        {c: '9'},
                        {c: '0'},
                        {c: '.'},
                        {c: '_'},
                        {c: '\"'}
                    ]
                },
                {
                    keys: [
                        {action: 'space', c: 'space', w: 183},
                        {action: 'clear', c: 'delete', w: 183},
                        {action: 'ok', c: 'ok', w: 183}
                    ]
                }
            ]
        }
    }
};

export default template;