export default (config) => {

    // perhaps do some intialization here based on config


    // variable to store the profile info
    let profile = null

    // retrieve info via moneybadger
    // (this should be made dynamic based on platform)
    var retrieveInfo = () => {
        return new Promise((resolve, reject) => {
            
            window.$badger.info().succes((data) => {
                // maybe do some preformatting of data
                // or some mapping (i.e. write key postcode to a uniform zipcode)
                // ...
                // store profile data for later use
                profile = data
                // resolve the data
                resolve(data)
            })
            .failure(() => {
                reject()
            })
        })
    }

    // get a specific piece of info
    const getInfo = (key) => {
        return new Promise((resolve, reject) => {
            if(!profile) {
                retrievInfo().then(data => {
                    resolve(data[key])
                })
            }
            else {
                resolve(profile[key])
            }
        })   
    }

    // public API
    return {
        zipcode() {
            return getInfo('zipcode')
        },
        timezone() {
            return getInfo('timezone')
        },
        partnerId() {
            return getInfo('partnerId')
        },
        receiverId() {
            return getInfo('receiverId')
        },
        deviceId() {
            return getInfo('deviceId')
        },
        deviceHash() {
            return getInfo('deviceHash')
        },
        deviceCapabilities() {
            return getInfo('deviceCapabilities')
        },
        householdId() {
            return getInfo('householdId')
        },
        clientId() {
            return getInfo('clientId')
        },
        locationId() {
            return getInfo('locationId')
        },
    }       
}