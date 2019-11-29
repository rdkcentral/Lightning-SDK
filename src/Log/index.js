import Settings from '../Settings'

const prepLog = (type, args) => {
  const colors = {
    Info: 'green',
    Debug: 'gray',
    Warn: 'orange',
    Error: 'red',
  }

  args = Array.from(args)
  return [
    '%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type),
    'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px',
    args,
  ]
}

export default {
  info() {
    Settings.get('app', 'log') && console.log.apply(null, prepLog('Info', arguments))
  },
  debug() {
    Settings.get('app', 'log') && console.debug.apply(null, prepLog('Debug', arguments))
  },
  error() {
    Settings.get('app', 'log') && console.error.apply(null, prepLog('Error', arguments))
  },
  warn() {
    Settings.get('app', 'log') && console.warn.apply(null, prepLog('Warn', arguments))
  },
}
