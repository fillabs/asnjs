import { DataCursor } from 'asnjs';
import {Length} from './Length.mjs';
import {OpenType} from './OpenType.mjs';
import {Tag} from './Tag.mjs';

/**
 * @typedef iChoice
 * @class
 */

/**
 * @param {{name:string,type:Object,extension:?boolean}[]}fields
 * @param {{extendable:boolean}[]} options 
 * @returns {iChoice}
 */
export var Choice = function (fields, options) {

    var Options = Object.assign({}, options);
    var extendable = false;
    var a = new Array();

    for (let i = 0; i < fields.length; i++) {
        let f = fields[i];
        if (f.extension) {
            Options.extendable = extendable = true;
        } else if (extendable) {
            f.extension = true;
        }
        if (f.name !== undefined || f.type !== undefined) {
            a.push(f);
        }
    }
    fields = a;

    /**
     * @augments iChoice
     */
    var C = class iChoice {
        constructor() {
        }

        /**
         * @param {DataCursor} dc 
         * @param {{keep_buffer:boolean}} options 
         * @constructs 
         */
        static from_oer(dc, options) {
            var x = new this();
            var initIndex = dc.index;
            var keep_buffer;
            if (options) {
                keep_buffer = options.keep_buffer;
                options.keep_buffer = undefined;
            }
            try {
                var tag = Tag.from_oer(dc);
                var e_end;
                if (tag.index >= fields.length) {
                    throw new RangeError('[' + initIndex + '] ' + x.constructor.name + ': tag ' + tag.index + ' is greater then field count');
                }
                var f = fields[tag.index];
                if (f === undefined) {
                    throw new TypeError('[' + initIndex + '] ' + x.constructor.name + ': undefined field for tag ' + tag.index);
                }
                //                    console.log('' + dc.index + ' Choice [' + tag.index + '] = ' + f.name + (f.extension ? ' (extension)' : ''));
                if (f.extension) {
                    let l = Length.from_oer(dc);
                    e_end = dc.index + l;
                }
                if (f.name) {
                    
                    Object.defineProperty(x, f.name, {
                        __proto__: null, enumerable: true, writable: true,
                        value: f.type ? ((dc, options)=>{
                            if(typeof f.type.from_oer === 'function'){
                                return f.type.from_oer(dc, options);
                            }
                            console.log("Oups!!!");
                            return null;
                        })(dc, options) : null
                    });
                    if (e_end !== undefined && e_end !== dc.index) {
                        throw new RangeError('[' + initIndex + '] ' + x.constructor.name + ':  ' + f.name + ': oversized extension');
                    }
                    x.tagIndex = tag.index;
                    x.tagName = f.name;
                }
            }
            catch (e) {
                throw e;
            }
            if (keep_buffer) {
                Object.defineProperty(x, 'oer', {
                    __proto__: null,
                    value: new Uint8Array(dc.buffer, dc.byteOffset + initIndex, dc.index - initIndex)
                });
            }
            return x;
        }
        /**
         * @param {DataCursor} dc 
         * @param {{keep_buffer:boolean}} options 
         * @returns {DataCursor}
         */
         to_oer(dc, options) {
            var keep_buffer;
            if (options) {
                keep_buffer = options.keep_buffer;
                options.keep_buffer = undefined;
            }
            var initIndex = dc.index;
            for (let i = 0; i < fields.length; i++) {
                let f = fields[i];
                if (this[f.name] !== undefined) {
                    Tag.to_oer(dc, Tag.CONTEXT_SPEC, i);
                    if (f.extension) {
                        OpenType.to_oer(dc, this[f.name]);
                    } else {
                        this[f.name].to_oer(dc);
                    }
                    break;
                }
            }
            if (i == fields.length) {
                throw new RangeError(x.constructor.name + ':  choice is not initialized');
            }
            if (keep_buffer) {
                Object.defineProperty(this, 'oer', {
                    __proto__: null,
                    value: new Uint8Array(dc.buffer, dc.byteOffset + initIndex, dc.index - initIndex)
                });
            }
        }
        
    };
    C.fields = fields;
    return C;
};
export default Choice;
//module.exports = Choice;
