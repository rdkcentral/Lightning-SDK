let getInfo = () => Promise.resolve()
let setInfo = () => Promise.resolve()

export const initProfile = (config) => {
    getInfo = config.getInfo
    setInfo = config.setInfo
}

const getOrSet = (key, params) => params ? setInfo(key, params) : getInfo(key)

// public API
export default {
    ageRating(params) {
        return getOrSet('ageRating', params)
    },
    city(params) {
        return getOrSet('city', params)
    },
    countryCode(params) {
        return getOrSet('countryCode', params)
    },
    ip(params) {
        return getOrSet('ip', params)
    },
    household(params) {
        return getOrSet('household', params)
    },
    language(params) {
        return getOrSet('language', params)
    },
    latlon(params) {
        return getOrSet('latlon', params)
    },
    locale(params) {
        return getOrSet('locale', params)
    },
    mac(params) {
        return getOrSet('mac', params)
    },
    operator(params) {
        return getOrSet('operator', params)
    },
    platform(params) {
        return getOrSet('platform', params)
    },
    packages(params) {
        return getOrSet('packages', params)
    },
    uid(params) {
        return getOrSet('uid', params)
    },
    stbType(params) {
        return getOrSet('stbType', params)
    }
}