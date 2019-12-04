import Lightning from '../Lightning'

export default class VersionLabel extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      color: 0x500078ac,
      h: 40,
      w: 100,
      x: w => w - 50,
      y: h => h - 50,
      mount: 1,
      Text: {
        w: w => w,
        h: h => h,
        y: 5,
        text: {
          fontSize: 22,
          textAlign: 'center',
        },
      },
    }
  }

  set version(version) {
    this.tag('Text').text = `v${version}`
    this.tag('Text').loadTexture()
    this.w = this.tag('Text').renderWidth + 40
  }
}
