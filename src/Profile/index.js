let getInfo = () => Promise.resolve()
let setInfo = () => Promise.resolve()

export const initProfile = (config) => {
    getInfo = config.getInfo
    setInfo = config.setInfo
}

const getOrSet = (key, params) => params ? setInfo(key, params) : getInfo(key)

// public API
export default {
    zipcode(params) {
        return getOrSet('zipcode', params)
    },
    timezone() {
        return getOrSet('timezone', params)
    },
    partnerId() {
        return getOrSet('partnerId', params)
    },
    receiverId() {
        return getOrSet('receiverId', params)
    },
    deviceId() {
        return getOrSet('deviceId', params)
    },
    deviceHash() {
        return getOrSet('deviceHash', params)
    },
    deviceCapabilities() {
        return getOrSet('deviceCapabilities', params)
    },
    householdId() {
        return getOrSet('householdId', params)
    },
    clientId() {
        return getOrSet('clientId', params)
    },
    locationId() {
        return getOrSet('locationId', params)
    },     
}
