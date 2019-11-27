import Lightning from '../Lightning'
// todo: review!
// the original ScaledImageTexture had some overhead I think
// but at the same this class is probably still missing a lot of stuff

export default class ScaledImageTexture extends Lightning.textures.ImageTexture {
  _getLookupId() {
    return `${this._src}-${this.scalingOptions.type}-${this.scalingOptions.width}-${this.scalingOptions.height}`
  }
}
