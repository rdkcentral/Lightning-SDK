export default class Slider extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                flex: {direction: 'row'}
            }
        }
    }

    set items(items) {
        this._reset();
        this.tag('Wrapper').children = items;
        this.scrollToFocus(true);
        if(items.length > 0) {
            this._setState('Filled');
        }
        else {
            this._setState('Empty');
        }
    }

    get items() {
        return this.tag('Wrapper').children;
    }

    get currentItem() {
        return this.items[this._index];
    }

    get index() {
        return this._index;
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

    set margin(v) {
        this._margin = v;
    }

    get margin() {
        return this._margin || 0;
    }

    set marginStart(v) {
        this._marginStart = v
    }

    get marginStart() {
        return this._marginStart || this.margin;
    }

    set marginEnd(v) {
        this._marginEnd = v;
    }

    get marginEnd() {
        return this._marginEnd || this.margin;
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

    get scrollTransitionSettings() {
        return this._scrollTransitionSettings;
    }

    set scrollTransition(v) {
        this._scrollTransitionSettings.patch(v);
    }

    get scrollTransition() {
        return this._scrollTransition;
    }

    get viewportSize() {
        return this.orientation === 'horizontal' ? this.w : this.h;
    }

    _getItemCenterPosition(item) {
        if(this.orientation === 'horizontal') {
            return item.finalX + (item.finalW * 0.5);
        }
        return item.finalY + (item.finalH * 0.5);
    }

    _getScrollPosition(position) {
        const s = this._fullSize;

        const viewportSize = this.viewportSize;
        const marginStart = this.marginStart;
        const marginEnd = this.marginEnd;

        const maxDistanceStart = 0.5 * viewportSize - marginStart;
        const maxDistanceEnd = 0.5 * viewportSize - marginEnd;
        if((position < maxDistanceStart) || (s < viewportSize - (marginStart + marginEnd))) {
            position = maxDistanceStart;
        }
        else if(position > s - maxDistanceEnd) {
            position = s - maxDistanceEnd;
        }
        return position - 0.5 * viewportSize;
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

            if(currentIndex !== this._index) {
                this.indexChanged({index: this._index, previousIndex: currentIndex, length: this.items.length});
            }
            this.scrollToFocus();
        }
        return false;
    }

    scrollToFocus(immediate) {
        if(this.currentItem) {
            const focusPosition = this._getItemCenterPosition(this.currentItem);
            const scrollPosition = this._getScrollPosition(focusPosition);
            if(this._scrollTransition.isRunning()) {
                this._scrollTransition.reset(-scrollPosition, 0.1);
            }
            else {
                this._scrollTransition.start(-scrollPosition);
            }
            if(immediate) {
                this._scrollTransition.finish();
            }
        }
    }

    setIndex(targetIndex, immediate = false) {
        if(targetIndex > -1 && targetIndex < this.items.length) {
            const currentIndex = this._index;
            this._index = targetIndex;
            this.indexChanged({index: this._index, previousIndex: currentIndex, immediate});
            this.scrollToFocus(immediate);
        }
    }

    indexChanged(event) {
        this.signal('indexChanged', event);
    }

    _getFocused() {
        return this;
    }

    _reset() {
        this._index = 0;
    }

    _construct() {
        this._index = 0;
        this._scrollTransitionSettings = this.stage.transitions.createSettings({})
    }

    _init() {
        const wrapper = this.tag('Wrapper');
        const or = this.orientation === 'horizontal' ? 'x' : 'y';
        wrapper.transition(or, this._scrollTransitionSettings);
        this._scrollTransition = wrapper.transition(or);
        wrapper.onAfterUpdate = () => {
            if(this.orientation === 'horizontal') {
                this._fullSize = wrapper.finalW;
            }
            else {
                this._fullSize = wrapper.finalH;
            }
        };
        this._setState('Empty')
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