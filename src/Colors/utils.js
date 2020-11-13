export const isObject = v => {
  return typeof v === 'object' && v !== null
}

export const isString = v => {
  return typeof v === 'string'
}

export const getRgbaComponents = argb => {
  let r = ((argb / 65536) | 0) % 256
  let g = ((argb / 256) | 0) % 256
  let b = argb % 256
  let a = (argb / 16777216) | 0
  return { r, g, b, a }
}

export const limitWithinRange = (num, min, max) => {
  return Math.min(Math.max(num, min), max)
}

export const mergeColors = (c1, c2, p) => {
  let r1 = ((c1 / 65536) | 0) % 256
  let g1 = ((c1 / 256) | 0) % 256
  let b1 = c1 % 256
  let a1 = (c1 / 16777216) | 0
  let r2 = ((c2 / 65536) | 0) % 256
  let g2 = ((c2 / 256) | 0) % 256
  let b2 = c2 % 256
  let a2 = (c2 / 16777216) | 0
  let r = r1 * p + r2 * (1 - p)
  let g = g1 * p + g2 * (1 - p)
  let b = b1 * p + b2 * (1 - p)
  let a = a1 * p + a2 * (1 - p)
  return Math.round(a) * 16777216 + Math.round(r) * 65536 + Math.round(g) * 256 + Math.round(b)
}

export const calculateAlpha = (argb, p) => {
  if (p > 1) {
    p /= 100
  } else if (p < 0) {
    p = 0
  }
  let r = ((argb / 65536) | 0) % 256
  let g = ((argb / 256) | 0) % 256
  let b = argb % 256
  return (r << 16) + (g << 8) + b + ((p * 255) | 0) * 16777216
}

export const mergeColorAlpha = (c, alpha) => {
  let a = (((c / 16777216) | 0) * alpha) | 0
  return (
    (((((c >> 16) & 0xff) * a) / 255) & 0xff) +
    ((((c & 0xff00) * a) / 255) & 0xff00) +
    (((((c & 0xff) << 16) * a) / 255) & 0xff0000) +
    (a << 24)
  )
}

const getArgbNumber = rgba => {
  rgba[0] = Math.max(0, Math.min(255, rgba[0]))
  rgba[1] = Math.max(0, Math.min(255, rgba[1]))
  rgba[2] = Math.max(0, Math.min(255, rgba[2]))
  rgba[3] = Math.max(0, Math.min(255, rgba[3]))
  let v = ((rgba[3] | 0) << 24) + ((rgba[0] | 0) << 16) + ((rgba[1] | 0) << 8) + (rgba[2] | 0)
  if (v < 0) {
    v = 0xffffffff + v + 1
  }
  return v
}

export const argbToHsva = argb => {
  const color = getRgbaComponents(argb)
  let r = color.r / 255
  let g = color.g / 255
  let b = color.b / 255

  let h = 0
  let s = 0
  const cMax = Math.max(r, g, b)
  const cMin = Math.min(r, g, b)
  const delta = cMax - cMin

  //calculate hue if cMax AND cMin are not both 0
  if (cMax !== 0 || cMin !== 0) {
    if (r === cMax) {
      h = (60 * ((g - b) / delta) + 360) % 360
    } else if (g === cMax) {
      h = (60 * ((b - r) / delta) + 120) % 360
    } else if (b === cMax) {
      h = (60 * ((r - g) / delta) + 240) % 360
    }
  }

  if (cMax > 0) {
    s = delta / cMax
  }
  return {
    h,
    s,
    v: cMax,
    a: color.a / 255,
  }
}

export const hsvaToArgb = color => {
  const h = color.h
  const c = color.v * color.s
  const m = color.v - c
  const x = c * (1.0 - Math.abs(((h / 60) % 2) - 1))
  let r = 0
  let g = 0
  let b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
  } else if (60 <= h && h < 120) {
    r = x
    g = c
  } else if (120 <= h && h < 180) {
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    b = x
  }

  r = Math.round((r + m) * 255.0)
  g = Math.round((g + m) * 255.0)
  b = Math.round((b + m) * 255.0)
  return getArgbNumber([r, g, b, color.a * 255])
}
