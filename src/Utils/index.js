let basePath = null

export const initUtils = (config) => {
    if(config.path) {
        basePath = config.path
    }
}

export default {
    getPath(relPath) {
        return basePath + '/' + relPath
    }
}