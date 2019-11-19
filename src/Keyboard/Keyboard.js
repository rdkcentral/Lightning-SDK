import Lightning from '../Lightning'

import KeyboardTemplate from "./SimpleKeyboardTemplate.js";
import KeyboardButton from "./KeyboardButton.js";

export default class Keyboard extends Lightning.Component {
    static _template() {
        return {

        };
    }

    _construct() {
        this._template = KeyboardTemplate;
    }

    set template(v) {
        this._template = v;
    }

    get keyboardTemplate() {
        return this._template;
    }

    get keyboardButton() {
        return KeyboardButton;
    }

    get maxCharacters() {
        return 40;
    }

    set value(v) {
        if(v.length < this.maxCharacters) {
            this._value = v;
            this.signal('valueChanged', {value: v});
        }
    }

    get value() {
        return this._value;
    }

    get rows() {
        return this.children;
    }

    get rowLength() {
        return this.rows[this.rowIndex].children.length;
    }

    get currentKey() {
        return this.children[this.rowIndex].children[this.colIndex] || null;
    }

    set layout(layout) {
        this._layout = layout;
        this._update();
    }

    get layout() {
        return this._layout;
    }

    _getFocused() {
        return this.currentKey;
    }

    _navigate(dir, value) {
        dir = (dir === 'up' || dir === 'down') ? 'vertical' : 'horizontal'
        if(dir === 'horizontal' && this.colIndex + value < this.rowLength && this.colIndex + value > -1) {
            this.previous = null;
            return this.colIndex += value;
        }
        else if(dir === 'vertical' && this.rowIndex + value < this.rows.length && this.rowIndex + value > -1) {
            const currentColIndex = this.colIndex;
            const targetRow = this.rowIndex + value;
            if(this.previous && this.previous.row === targetRow) {
                const tmp = this.previous.col;
                this.previous.col = this.colIndex;
                this.colIndex = tmp;
            }
            else {
                const targetRow = this.children[(this.rowIndex + value)];
                const targetItems = targetRow.children;
                const ck = this.currentKey;
                let target = 0;
                for(let i = 0; i < targetItems.length; i++) {
                    const ckx = this.children[this.rowIndex].x + ck.x;
                    const tix = targetRow.x + targetItems[i].x;
                    target = i;
                    if((ckx >= tix && ckx <= tix + targetItems[i].w) || (tix >= ckx && tix <= ckx + ck.w)) {
                        break;
                    }
                }
                this.colIndex = target;
            }
            this.previous = {col: currentColIndex, row: this.rowIndex};
            return this.rowIndex += value;
        }
        return false;
    }

    _update() {
        if(this._layout && this.keyboardTemplate.layouts[this._layout] === undefined) {
            console.error(`Configured layout "${this.layout}" does not exist. Reverting to "${Object.keys(this.keyboardTemplate.layouts)[0]}"`);
            this._layout = null
        }
        if(!this._layout) {
            this._layout = Object.keys(this.keyboardTemplate.layouts)[0];
        }
        const {keyWidth, keyHeight, horizontalSpacing = 0, verticalSpacing = 0, layouts} = this.keyboardTemplate;

        this.children = layouts[this._layout].rows.map((row, rowIndex) => {
            let keyOffset = 0;
            const {x = 0, rowVerticalSpacing = verticalSpacing, rowHorizontalSpacing = horizontalSpacing, keys = []} = row;
            return {y: keyHeight * rowIndex + (rowIndex * rowVerticalSpacing), x,
                children: keys.map((key) => {
                    key = Object.assign({action: 'input'}, key);
                    const prevOffset = keyOffset;
                    const {w = keyWidth, h = keyHeight, action, toLayout} = key;
                    keyOffset += w + rowHorizontalSpacing;
                    return {key, action, toLayout, x: prevOffset, w, h, type: this.keyboardButton}
                })
            };
        });
    }

    reset() {
        this.colIndex = 0;
        this.rowIndex = 0;
        this._value = '';
        this.previous = null;
    }

    _init() {
        this.reset();
        this._update();
    }

    _handleRight() {
        return this._navigate('right', 1);
    }

    _handleLeft() {
        return this._navigate('left', -1);
    }

    _handleUp() {
        return this._navigate('up', -1);
    }

    _handleDown() {
        return this._navigate('down', 1);
    }

    _handleEnter() {
        const key = this.currentKey;
        switch(key.action) {
            case 'input':
                this.value += key.c
                break;
            case 'backspace':
                this.value = this.value.slice(0, -1);
                break
            case 'space':
                if(this.value.length > 0){
                    this.value += ' ';
                }
                break;
            case 'delete':
                this.value = '';
                break;
            case 'toggleToLayout':
                this.layout = key.toLayout;
                break;
            default:
                this.signal(key.action, key);
                break;
        }
    }
}