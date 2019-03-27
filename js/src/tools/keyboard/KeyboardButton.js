export default class KeyboardButton extends lng.Component {
    static _template() {
        return {
            Background: {colorTop: 0x80e8e8e8, colorBottom: 0x80d1d1d1},
            Content: {}
        };
    }

    set action(v) {
        this._action = v;
    }

    get action() {
        return this._action;
    }

    get c() {
        return this.key.c;
    }

    set key(v) {
        this._key = v;
        if(this.active) {
            this._update();
        }
    }

    _update() {
        this.patch(this._getPatch(this._key));
    }
    
    _getPatch(key) {
        let content = key.patch || {text: {text: key.c, fontFace: 'RobotoRegular', textAlign: 'center', fontSize: 36}};
        return {
            Background: {texture: lng.Tools.getRoundRect(this.w, this.h, 7, 0, 0xffffffff, true, 0xffffffff)},
            Content: {mountX: 0.5, mountY: 0.4, x: this.w/2, y: this.h/2, ...content}
        };
    }

    get key() {
        return this._key;
    }

    _focus() {
        this.patch({
            Background: {smooth: {colorTop: 0xff3777ee, colorBottom: 0xff2654a8}}
        });
    }

    _unfocus() {
        this.patch({
            Background: {smooth: {colorTop: 0x80e8e8e8, colorBottom: 0x80d1d1d1}}
        });
    }

    _firstActive() {
        this._update();
    }
}