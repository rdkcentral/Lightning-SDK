interface EventEmitter extends Object {
    on(name: string, listener: Function): void;
    once(name: string, listener: Function): void;
    has(name: string, listener: Function): void;
    off(name: string, listener: Function): void;
    allOff(name: string): void;
    emit(name: string, arg1: any, arg2: any, arg3: any): void;
}
export declare const defineEmitter: (name?: string) => EventEmitter;
export declare const removeEmitter: (name: string) => void;
export declare const getEmitter: (name: string) => EventEmitter | undefined;
export declare const hasEmitter: (name: string) => boolean;
declare const eventEmitter: {
    on(name: string, listener: Function): void;
    once(name: string, listener: Function): void;
    has(name: string, listener: Function): void;
    off(name: string, listener: Function): void;
    allOff(name: string): void;
    emit(name: string, arg1: any, arg2: any, arg3: any): void;
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
};
export default eventEmitter;
