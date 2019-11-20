// quick proof of concept for now

window.startApp = function(appSettings, platformSettings, appIdentifier) {
  console.time('app')

  loadJS('./dist/appBundle.js').then(() => {
    console.time('app2')
    const app = window[appIdentifier](appSettings, platformSettings)
    document.body.appendChild(app.stage.getCanvas())
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
