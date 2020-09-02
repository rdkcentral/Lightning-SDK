export default class Vector {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }
}
