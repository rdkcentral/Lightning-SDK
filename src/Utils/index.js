let basePath = null

export default {
    setPath(path) {
        basePath = path
    },
    getPath(relPath) {
        return basePath + '/' + relPath
    }
}