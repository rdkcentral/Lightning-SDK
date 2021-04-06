import {filters} from './../utils'

/**
 * @class Validator representing all validations
 */
export default class Validator {

    /**
     * Invoke all the configured validators on audio
     * @param {Object} param The audio parameter
     * @param {number} val The value for validation
     * @return {Boolean} The result of given value pass the all the
     * configured validation rules or not
     */
    validate(param, val){
        return param.validator.every( rule => {
            return this[rule](param, val)
        })
    }

    /**
     * Check the given value is number or not
     */
    isNumber(param, val){
        if(isNaN(val)){
            console.error(console.error(`${param.name} must be a number`))
            return false
        }
        return true
    }

    /**
     * Check the given value is withing the audio parameter range or not
     */
    range(param, val){
        if(val < param.range[0] || val > param.range[1]){
            console.warn(`${param.name} must be in range (${param.range})`)
            return false
        }
        return true
    }

    isString(param, val){
        if(Object.prototype.toString.call(val) == "[object String]"){
            return true
        }
        console.error(`${param.name} must be a string`)
        return false
    }

    /**
     * Check given filter is valid filter type or not
     */
    isValidFilterType(param, val){
        if(param.filters.includes(val)){
            return true
        }
        console.error(`${param.name} is not a valid filter type`)
        return false
    }
}