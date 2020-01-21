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
    Settings.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments))
  },
  debug() {
    Settings.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments))
  },
  error() {
    Settings.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments))
  },
  warn() {
    Settings.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments))
  },
}
