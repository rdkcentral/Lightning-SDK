import Validator from './Validator'

export default class BasePanner {
    constructor(){
        const commonValidators = ["isNumber"]

        this._coneInnerAngle = {
            name: 'coneInnerAngle',
            validator: commonValidators
        }

        this._coneOuterAngle = {
            name: 'coneOuterAngle',
            validator: commonValidators
        }

        this._coneOuterGain = {
            name: 'coneOuterGain',
            validator: commonValidators
        }

        this._distanceModel = {
            name: 'distanceModel',
            validator: ['isString', 'isExists'],
            possibleValues: ['linear', 'inverse', 'exponential']
        }

        this._maxDistance = {
            name: 'maxDistance',
            validator: commonValidators
        }

        this._orientationX = {
            name: 'orientationX',
            validator: commonValidators
        }

        this._orientationY = {
            name: 'orientationY',
            validator: commonValidators
        }

        this._orientationZ = {
            name: 'orientationZ',
            validator: commonValidators
        }

        this._panningModel = {
            name: 'panningModel',
            validator: ['isString', 'isExists'],
            possibleValues: ['equalpower', 'HRTF']
        }

        this._positionX = {
            name: 'positionX',
            validator: commonValidators
        }

        this._positionY = {
            name: 'positionY',
            validator: commonValidators
        }

        this._positionZ = {
            name: 'positionZ',
            validator: commonValidators
        }

        this._refDistance = {
            name: 'refDistance',
            validator: commonValidators
        }

        this._rolloffFactor = {
            name: 'rolloffFactor',
            validator: commonValidators
        }

        this._validator = new Validator()
    }
}