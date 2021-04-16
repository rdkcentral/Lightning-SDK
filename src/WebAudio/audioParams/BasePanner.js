import Validator from './Validator'

export default class BasePanner {
    constructor(){
        const commonValidators = ["isNumber"]

        this._coneInnerAngle = {
            name: 'coneInnerAngle',
            validator: commonValidators,
            readOnly: false
        }

        this._coneOuterAngle = {
            name: 'coneOuterAngle',
            validator: commonValidators,
            readOnly: false
        }

        this._coneOuterGain = {
            name: 'coneOuterGain',
            validator: commonValidators,
            readOnly: false
        }

        this._distanceModel = {
            name: 'distanceModel',
            validator: ['isString', 'isExists'],
            possibleValues: ['linear', 'inverse', 'exponential'],
            readOnly: false
        }

        this._maxDistance = {
            name: 'maxDistance',
            validator: commonValidators,
            readOnly: false
        }

        this._orientationX = {
            name: 'orientationX',
            validator: commonValidators,
            readOnly: true
        }

        this._orientationY = {
            name: 'orientationY',
            validator: commonValidators,
            readOnly: true
        }

        this._orientationZ = {
            name: 'orientationZ',
            validator: commonValidators,
            readOnly: true
        }

        this._panningModel = {
            name: 'panningModel',
            validator: ['isString', 'isExists'],
            possibleValues: ['equalpower', 'HRTF'],
            readOnly: false
        }

        this._positionX = {
            name: 'positionX',
            validator: commonValidators,
            readOnly: true
        }

        this._positionY = {
            name: 'positionY',
            validator: commonValidators,
            readOnly: true
        }

        this._positionZ = {
            name: 'positionZ',
            validator: commonValidators,
            readOnly: true
        }

        this._refDistance = {
            name: 'refDistance',
            validator: commonValidators,
            readOnly: false
        }

        this._rolloffFactor = {
            name: 'rolloffFactor',
            validator: commonValidators,
            readOnly: false
        }

        this._validator = new Validator()
    }
}