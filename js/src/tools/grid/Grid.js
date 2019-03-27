export default class Grid extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                flex: {direction: 'column', wrap: true}
            }
        }
    }

    set items(items) {
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
        return this.items[this._calculateIndex()];
    }

    get index() {
        return this._calculateIndex();
    }

    get row() {
        return this.orientation === 'horizontal' ? this._mainAxisIndex : this._crossAxisIndex;
    }

    get rows() {
        return this.orientation === 'horizontal' ? this._navigationBounds.mainAxis : this._navigationBounds.crossAxis;
    }

    get column() {
        return this.orientation === 'horizontal' ? this._crossAxisIndex : this._mainAxisIndex;
    }

    get columns() {
        return this.orientation === 'horizontal' ? this._navigationBounds.crossAxis : this._navigationBounds.mainAxis;
    }

    set orientation(v) {
        this._orientation = v;
        if(v === 'vertical') {
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
        const isHorizontal = this.orientation === 'horizontal';
        const currentIndex = this._calculateIndex();
        const currentRow = this.row;
        const currentColumn = this.column;
        let mainAxisIndex = this._mainAxisIndex;
        let crossAxisIndex = this._crossAxisIndex;
        const navBounds = this._navigationBounds;

        const calc = dir === 'left' || dir === 'up' ? -1 : 1;

        let navigateOver = 'mainAxis';

        if((isHorizontal && (dir === 'left' || dir === 'right')) || (!isHorizontal && (dir === 'up' || dir === 'down'))){
            navigateOver = 'crossAxis';
        }

        if(navigateOver === 'mainAxis') {
            mainAxisIndex += calc;
        }
        else {
            crossAxisIndex += calc;
        }

        if(mainAxisIndex > -1 && crossAxisIndex > -1 && mainAxisIndex < navBounds.mainAxis && crossAxisIndex < navBounds.crossAxis) {
            const items = this.items;
            const itemIndex = this._calculateIndex(mainAxisIndex, crossAxisIndex);

            if(!items[itemIndex] && navigateOver === 'crossAxis') {
                mainAxisIndex = (items.length - 1) % navBounds.mainAxis;
            }
            else if(!items[itemIndex] && navigateOver === 'mainAxis' && crossAxisIndex > 0 ) {
                crossAxisIndex -= 1;
            }
            else if(!items[itemIndex]){
                return false;
            }

            this._crossAxisIndex = crossAxisIndex;
            this._mainAxisIndex = mainAxisIndex;

            this.indexChanged({
                index: this._calculateIndex(),
                previousIndex: currentIndex,
                row: this.row,
                previousRow: currentRow,
                column: this.column,
                previousColumn: currentColumn,
                immediate: false
            });
            this.scrollToFocus();
        }
        else {
            return false;
        }
    }

    _calculateNavigationBounds() {
        const wrapper = this.tag('Wrapper');
        if(this.items.length > 0 && wrapper.flex) {
            const lines = wrapper.flex._layout._lines
            this._navigationBounds = {
                mainAxis: lines[0].numberOfItems,
                crossAxis: lines.length
            };
        }
    }

    _calculateIndex(mainAxisIndex = this._mainAxisIndex, crossAxisIndex = this._crossAxisIndex) {
        return crossAxisIndex * this._navigationBounds.mainAxis + mainAxisIndex;
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
            const currentIndex = this._calculateIndex();
            const currentRow = this.row;
            const currentColumn = this.column;
            let main = targetIndex % this._navigationBounds.mainAxis;
            let cross = (targetIndex - main) / this._navigationBounds.mainAxis;
            this._mainAxisIndex = main;
            this._crossAxisIndex = cross;

            this.indexChanged({
                index: this._calculateIndex(),
                previousIndex: currentIndex,
                row: this.row,
                previousRow: currentRow,
                column: this.column,
                previousColumn: currentColumn,
                immediate: false
            });
            this.scrollToFocus(immediate);
        }
    }

    reset() {
        this._mainAxisIndex = 0;
        this._crossAxisIndex = 0;
        this._navigationBounds = {
            mainAxis: 0,
            crossAxis: 0
        };
    }

    indexChanged(event) {
        this.signal('indexChanged', event);
    }

    _getFocused() {
        return this;
    }

    _construct() {
        this.reset();
        this._scrollTransitionSettings = this.stage.transitions.createSettings({})
    }

    _init() {
        const wrapper = this.tag('Wrapper');

        if(this.orientation === 'horizontal') {
            wrapper.h = this.h;
        }
        else {
            wrapper.w = this.w;
        }

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
            this._calculateNavigationBounds();
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