// dummy implementation of send metric (should be a function in platform plugin, passed to initMetrics)
let sendMetric = (type, event, params) => {
  console.log('Sending metric', { type }, { event }, { params })
}

export const initMetrics = config => {
  sendMetric = config.sendMetric
}

// public API
export default {
  app: {
    // called automatically when Application is launched (after plugins are initialized)
    launch(params = {}) {
      sendMetric('app', 'launch', params)
    },
    // called automatically in Application when everything is loaded and App is attached
    loaded(params = {}) {
      sendMetric('app', 'loaded', params)
    },
    ready(params = {}) {
      sendMetric('app', 'ready', params)
    },
    // can we do this automatically?
    close(params = {}) {
      sendMetric('app', 'close', params)
    },
    // todo: possibly make arguments like code and visible optional?
    error(message, code, visible, params = {}) {
      params.message = message
      params.code = code
      params.visible = visible
      sendMetric('app', 'error', params)
    },
  },
  page: {
    view(name, params = {}) {
      params.name = name
      sendMetric('page', 'view', params)
    },
    leave(name, params = {}) {
      params.name = name
      sendMetric('page', 'leave', params)
    },
  },
  user: {
    click(name, params = {}) {
      params.name = name
      sendMetric('user', 'click', params)
    },
    input(name, params = {}) {
      params.name = name
      sendMetric('user', 'input', params)
    },
    // todo: possibly make arguments like code and visible optional?
    error(message, code, visible, params = {}) {
      params.message = message
      params.code = code
      params.visible = visible
      sendMetric('user', 'error', params)
    },
  },
  // not sure about this part yet ...
  // these metrics should be integrated in the MediaPlayer class so they are called without each dev having to implement them
  // (with option to DIY when not using standard MediaPlayer)
  // example usage:
  // const metrics = Metrics.media('http://metrological.com/video.mp4)
  // metrics.
  media(url) {
    return {
      abort(params = {}) {
        params.url = url
        sendMetric('media', 'abort', params)
      },
      canplay(params = {}) {
        params.url = url
        sendMetric('media', 'canplay', params)
      },
      ended(params = {}) {
        params.url = url
        sendMetric('media', 'ended', params)
      },
      pause(params = {}) {
        params.url = url
        sendMetric('media', 'pause', params)
      },
      play(params = {}) {
        params.url = url
        sendMetric('media', 'play', params)
      },
      suspend(params = {}) {
        params.url = url
        sendMetric('media', 'suuspend', params)
      },
      volumechange(params = {}) {
        params.url = url
        sendMetric('media', 'volumechange', params)
      },
      waiting(params = {}) {
        params.url = url
        sendMetric('media', 'waiting', params)
      },
      error(error, params = {}) {
        // error is a HTMLMediaElement error (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error)
        params.message = error.message
        params.code = error.code
        params.visible = false
        sendMetric('media', 'error', params)
      },
    }
  },
  // possibly make arguments like code and visible optional?
  error(type, message, code, visible, params = {}) {
    params.message = message
    params.code = code
    params.visible = visible
    sendMetric(type, 'error', params)
  },
  event(type, name, params) {
    sendMetric(type, name, params)
  },
}
