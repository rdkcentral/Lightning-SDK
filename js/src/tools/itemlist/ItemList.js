export default class ItemList extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                flex: {direction: 'row'}
            }
        };
    }

    set items(items) {
        this.tag('Wrapper').children = items;
        this._index = 0;
        if(items.length > 0) {
            this._setState('Filled');
        }
        else {
            this._setState('Empty');
        }
    }

    get items() {
        return this.tag('Wrapper').children
    }

    get currentItem() {
        return this.items[this._index];
    }

    get length() {
        return this.items.length;
    }

    set orientation(v) {
        this._orientation = v;
        if(v === 'horizontal') {
            this.tag('Wrapper').patch({flex: {direction: 'row'}})
        }
        else {
            this.tag('Wrapper').patch({flex: {direction: 'column'}})
        }
    }

    get orientation() {
        return this._orientation || 'horizontal';
    }

    set jump(bool) {
        this._jump = bool;
    }

    get jump() {
        return this._jump || false;
    }

    set jumpToStart(bool) {
        this._jumpToStart = bool;
    }

    get jumpToStart() {
        return this._jumpToStart !== undefined ? this._jumpToStart : this.jump;
    }

    set jumpToEnd(bool) {
        this._jumpToEnd = bool;
    }

    get jumpToEnd() {
        return this._jumpToEnd !== undefined ? this._jumpToEnd : this.jump;
    }

    _navigate(dir) {
        const ori = this.orientation;
        if(((dir === 'right' || dir === 'left') && ori === 'horizontal') || ((dir === 'up' || dir === 'down') && ori === 'vertical')) {
            const length = this.items.length;
            const currentIndex = this._index;
            let targetIndex = currentIndex + 1;
            if(dir === 'left' || dir === 'up') {
                targetIndex = currentIndex - 1;
            }

            if(targetIndex > -1 && targetIndex < length) {
                this._index = targetIndex;
            }
            else if(this.jump || (this.jumpToStart || this.jumpToEnd)) {
                if(targetIndex < 0 && this.jumpToEnd) {
                    this._index = targetIndex + length;
                }
                else if(targetIndex === length && this.jumpToStart){
                    this._index = 0;
                }
            }
            else {
                return false;
            }

            if(currentIndex !== this._index) {
                this.indexChanged({index: this._index, previousIndex: currentIndex});
            }
        }
        return false;
    }

    setIndex(targetIndex) {
        if(targetIndex > -1 && targetIndex < this.items.length) {
            const currentIndex = this._index;
            this._index = targetIndex;
            this.indexChanged({index: this._index, previousIndex: currentIndex});
        }
    }

    indexChanged(event) {
        this.signal('indexChanged', event);
    }

    _getFocused() {
        return this;
    }

    _construct() {
        this._index = 0;
    }

    _init() {
        this._setState('Empty');
    }

    static _states() {
        return [
            class Empty extends this {
            },
            class Filled extends this {
                _getFocused() {
                    return this.currentItem;
                }
                _handleRight() {
                    return this._navigate('right');
                }

                _handleLeft() {
                    return this._navigate('left');
                }

                _handleUp() {
                    return this._navigate('up');
                }

                _handleDown() {
                    return this._navigate('down');
                }
            }
        ]
    }
}