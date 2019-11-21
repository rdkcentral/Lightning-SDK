// quick proof of concept for now

window.startApp = function(appSettings, platformSettings, appData) {
  console.time('app')

  getAppId().then(appIdentifier => {
    loadJS('./dist/appBundle.js').then(() => {
      console.time('app2')
      const app = window[appIdentifier](appSettings, platformSettings, appData)
      document.body.appendChild(app.stage.getCanvas())
    })
  })
}

const getAppId = () => {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const metadata = JSON.parse(xhr.responseText)
        resolve('APP_' + metadata.identifier.replace(/[^0-9a-zA-Z_$]/g, '_'))
      }
    }
    xhr.open('GET', './metadata.json')
    xhr.send(null)
  })
}

const loadJS = (url, id) => {
  return new Promise(resolve => {
    console.log('loadJS', url)
    const tag = document.createElement('script')
    tag.onload = resolve
    tag.src = url

    if (id) tag.id = id

    document.body.appendChild(tag)
  })
}
