export const fade = (i, o) => {
  return new Promise(resolve => {
    i.patch({
      alpha: 0,
      visible: true,
      smooth: {
        alpha: [1, { duration: 0.2, delay: 0.1 }],
      },
    })
    // resolve on y finish
    i.transition('alpha').on('finish', () => {
      if (o) {
        o.visible = false
      }
      resolve()
    })
  })
}

export const crossFade = (i, o) => {
  return new Promise(resolve => {
    i.patch({
      alpha: 0,
      visible: true,
      smooth: {
        alpha: [1, { duration: 0.2, delay: 0.1 }],
      },
    })
    if (o) {
      o.patch({
        smooth: {
          alpha: [0, { duration: 0.2, delay: 0.1 }],
        },
      })
    }
    // resolve on y finish
    i.transition('alpha').on('finish', () => {
      resolve()
    })
  })
}

export const up = (i, o) => {
  return new Promise(resolve => {
    i.patch({
      y: 1080,
      visible: true,
      smooth: {
        y: [0, { duration: 0.6, delay: 0.1 }],
      },
    })
    // out is optional
    if (o) {
      o.patch({
        y: 0,
        smooth: {
          y: [-1080, { duration: 0.4, delay: 0.1 }],
        },
      })
    }
    // resolve on y finish
    i.transition('y').on('finish', () => {
      resolve()
    })
  })
}

export const left = (i, o) => {
  return new Promise(resolve => {
    i.patch({
      x: 1920,
      visible: true,
      smooth: {
        x: [0, { duration: 0.4, delay: 0.1 }],
      },
    })
    // out is optional
    if (o) {
      o.patch({
        y: 0,
        smooth: {
          x: [-1920, { duration: 0.4, delay: 0.1 }],
        },
      })
    }
    // resolve on y finish
    i.transition('x').on('ready', () => {
      resolve()
    })
  })
}
