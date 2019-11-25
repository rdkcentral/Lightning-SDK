let sendMetric = (type, event, params) => {
  console.log('Sending metric', { type }, { event }, { params })
}

export const initMetrics = config => {
  sendMetric = config.sendMetric
}

// available metric per category
const metrics = {
  app: ['launch', 'loaded', 'ready', 'close'],
  page: ['view', 'leave'],
  user: ['click', 'input'],
  media: ['abort', 'canplay', 'ended', 'pause', 'play', 'suspend', 'volumechange', 'waiting'],
}

// error metric function (added to each category)
const errorMetric = (type, message, code, visible, params = {}) => {
  params = { params, ...{ message, code, visible } }
  sendMetric(type, 'error', params)
}

const Metric = (type, events) => {
  return events.reduce(
    (obj, event) => {
      obj[event] = (params = {}) => sendMetric(type, event, params)
      return obj
    },
    {
      error(message, code, params) {
        errorMetric(type, message, code, params)
      },
      event(name, params) {
        sendMetric(type, name, params)
      },
    }
  )
}

const Metrics = types => {
  return Object.keys(types).reduce(
    (obj, type) => {
      obj[type] = Metric(type, types[type])
      return obj
    },
    { error: errorMetric, event: sendMetric }
  )
}

export default Metrics(metrics)
