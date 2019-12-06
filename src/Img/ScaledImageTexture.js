import Lightning from '../Lightning'

export default class ScaledImageTexture extends Lightning.textures.ImageTexture {
  constructor(stage) {
    super(stage)
    this._scalingOptions = undefined
  }

  set options(options) {
    this.resizeMode = this._scalingOptions = options
  }

  _getLookupId() {
    return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`
  }

  getNonDefaults() {
    const obj = super.getNonDefaults()
    if (this._src) {
      obj.src = this._src
    }
    return obj
  }
}
