export default class NoopMediaplayer extends lng.Component {

    static _template() {
        return {
            Video: {
                w: 1920, h: 1080
            }
        };
    }

    open(url) {
        console.log('Playing stream', url);
    }

    close() {
    }

    playPause() {
        if (this.isPlaying()) {
            this.doPause();
        } else {
            this.doPlay();
        }
    }

    isPlaying() {
        return (this._getState() === "Playing");
    }

    doPlay() {
    }

    doPause() {
    }

    reload() {
    }

    getPosition() {
        return Promise.resolve(0);
    }

    setPosition(pos) {
    }

    getDuration() {
        return Promise.resolve(0);
    }

    seek(time, absolute = false) {
    }

    updateSettings(settings = {}) {
    }

    static _states() {
        return [
            class Playing extends this {
                static _states() {
                    return [
                        class Paused extends this {
                        }
                    ]
                }
            }
        ]
    }

}